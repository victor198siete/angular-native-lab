import { Component, NO_ERRORS_SCHEMA, forwardRef, signal } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormField, form, required } from '@angular/forms/signals';
import { TextInput } from '@ng-native/components';
import { fireEvent, render, screen, userEvent } from '@ng-native/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';

/**
 * Which Angular form patterns bind to a native <text-input>, in Node against the fake native
 * layer. Join uses Signal Forms. ng-native's components implement no ControlValueAccessor, and
 * Reactive Forms and ngModel still work: Angular binds them to the element's value model. A
 * control of the app's own with an accessor works as well. Device results are in the README.
 */

const text = () => screen.getByTestId('field').props['text'];
const settle = () => new Promise((resolve) => setTimeout(resolve, 10));

@Component({
  selector: 'lab-reactive',
  imports: [ReactiveFormsModule, TextInput],
  template: '<text-input testID="field" [formControl]="name" />',
})
class ReactiveForm {
  name = new FormControl('Ada', Validators.required);
}

@Component({
  selector: 'lab-ng-model',
  imports: [FormsModule, TextInput],
  template: '<text-input testID="field" [(ngModel)]="name" />',
})
class TemplateDrivenForm {
  name = 'Ada';
}

/** A custom control the way Reactive Forms code bases write them. State is a signal: zoneless. */
@Component({
  selector: 'lab-name-control',
  imports: [TextInput],
  template: '<text-input testID="field" [value]="value()" (changeText)="type($event)" />',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NameControl), multi: true }],
})
class NameControl implements ControlValueAccessor {
  readonly value = signal('');
  private onChange: (value: string) => void = () => {};

  type(value: string): void {
    this.value.set(value);
    this.onChange(value);
  }

  writeValue(value: string | null): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(): void {}
}

@Component({
  selector: 'lab-cva-signal-forms',
  imports: [FormField, NameControl],
  template: '<lab-name-control [formField]="f.name" />',
})
class CvaWithSignalForms {
  readonly data = signal({ name: 'Ada' });
  readonly f = form(this.data, (path) => required(path.name));
}

@Component({
  selector: 'lab-cva-reactive',
  imports: [ReactiveFormsModule, NameControl],
  template: '<lab-name-control [formControl]="name" />',
})
class CvaWithReactiveForms {
  name = new FormControl('Ada');
}

/**
 * FormField left out on purpose. The type check (ngc, strict templates) refuses this with NG8002;
 * the build does not type-check, so the schema keeps typecheck green and the test shows runtime.
 */
@Component({
  selector: 'lab-missing-form-field',
  imports: [TextInput],
  schemas: [NO_ERRORS_SCHEMA],
  template: '<text-input testID="field" [formField]="f.name" />',
})
class MissingFormField {
  readonly data = signal({ name: 'Ada' });
  readonly f = form(this.data, (path) => required(path.name));
}

describe('forms on a native <text-input>', () => {
  afterEach(() => vi.restoreAllMocks());

  it('Reactive Forms: [formControl] binds both ways', async () => {
    const { componentRef } = await render(ReactiveForm);
    const name = componentRef.instance.name;
    expect(text()).toBe('Ada');

    await userEvent.setup().type(screen.getByTestId('field'), 'x');
    expect(name.value).toBe('Adax');

    name.setValue('Grace');
    await settle();
    expect(text()).toBe('Grace');
  });

  it('Reactive Forms: blur marks touched, disable() makes the field read-only', async () => {
    const { componentRef } = await render(ReactiveForm);
    const name = componentRef.instance.name;
    name.setValue('');
    await settle();
    expect(name.invalid).toBe(true);

    await fireEvent.focus(screen.getByTestId('field'));
    await fireEvent.blur(screen.getByTestId('field'));
    expect(name.touched).toBe(true);

    name.disable();
    await settle();
    expect(screen.getByTestId('field').props['editable']).toBe(false);

    name.enable();
    await settle();
    expect(screen.getByTestId('field').props['editable']).not.toBe(false);
  });

  it('template-driven: [(ngModel)] binds both ways', async () => {
    const { componentRef } = await render(TemplateDrivenForm);
    expect(text()).toBe('Ada');

    await userEvent.setup().type(screen.getByTestId('field'), 'x');
    expect(componentRef.instance.name).toBe('Adax');
  });

  it('a ControlValueAccessor works with Signal Forms [formField]', async () => {
    const { componentRef } = await render(CvaWithSignalForms);
    expect(text()).toBe('Ada');

    await userEvent.setup().type(screen.getByTestId('field'), 'x');
    expect(componentRef.instance.data().name).toBe('Adax');
  });

  it('a ControlValueAccessor works with Reactive Forms [formControl]', async () => {
    const { componentRef } = await render(CvaWithReactiveForms);
    expect(text()).toBe('Ada');

    await userEvent.setup().type(screen.getByTestId('field'), 'x');
    expect(componentRef.instance.name.value).toBe('Adax');
  });

  it('without FormField in imports, [formField] binds nothing and says so in development', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { componentRef } = await render(MissingFormField);

    expect(error).toHaveBeenCalledWith(expect.stringContaining("Can't bind to 'formField' on <text-input>"));
    expect(text() ?? '').toBe('');

    await userEvent.setup().type(screen.getByTestId('field'), 'x');
    expect(componentRef.instance.data().name).toBe('Ada');
  });
});
