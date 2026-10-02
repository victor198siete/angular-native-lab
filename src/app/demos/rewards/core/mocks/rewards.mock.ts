import type { Reward, RewardCategory, RewardIcon } from '../models/index.ts';
import type { MockLanguage, Translated } from './language.ts';
import { seededRandom } from './seeded-random.ts';

interface Product {
  readonly title: Translated;
  /** Fictional brand: the same in every language. */
  readonly partner: string;
  readonly icon: RewardIcon;
  readonly baseCost: number;
  readonly description: Translated;
}

interface Variant {
  readonly label: Translated;
  readonly costFactor: number;
}

interface CategorySpec {
  readonly products: readonly Product[];
  readonly variants: readonly Variant[];
}

const CATALOG: Record<RewardCategory, CategorySpec> = {
  travel: {
    variants: [
      { label: { en: 'Weekend', es: 'Fin de semana' }, costFactor: 1 },
      { label: { en: 'For 2 people', es: 'Para 2 personas' }, costFactor: 1.8 },
      { label: { en: 'Full week', es: 'Semana completa' }, costFactor: 2.6 },
      { label: { en: 'Premium edition', es: 'Edición premium' }, costFactor: 3.4 },
    ],
    products: [
      { title: { en: 'Getaway to Cartagena', es: 'Escapada a Cartagena' }, partner: 'Aerolínea Cóndor', icon: 'palmtree', baseCost: 9000, description: { en: 'Direct flight with taxes included to the walled city.', es: 'Vuelo directo e impuestos incluidos hacia la ciudad amurallada.' } },
      { title: { en: 'Boutique hotel in Medellín', es: 'Hotel boutique en Medellín' }, partner: 'Hoteles Brisa', icon: 'hotel', baseCost: 4200, description: { en: 'Nights with a buffet breakfast in El Poblado.', es: 'Noches de alojamiento con desayuno buffet en El Poblado.' } },
      { title: { en: 'Flight to Mexico City', es: 'Vuelo a Ciudad de México' }, partner: 'Vuelos Quetzal', icon: 'plane', baseCost: 14000, description: { en: 'Round-trip economy ticket with a checked bag.', es: 'Tiquete de ida y vuelta en clase turista con equipaje de bodega.' } },
      { title: { en: 'Airport lounge pass', es: 'Pase de sala VIP' }, partner: 'Salas Altitud', icon: 'armchair', baseCost: 1800, description: { en: 'Access to lounges in more than 1,400 airports worldwide.', es: 'Acceso a salas VIP en más de 1.400 aeropuertos del mundo.' } },
      { title: { en: 'Caribbean cruise', es: 'Crucero por el Caribe' }, partner: 'Cruceros Coral', icon: 'ship', baseCost: 22000, description: { en: 'Seven-day itinerary with full board.', es: 'Itinerario de siete días con pensión completa a bordo.' } },
      { title: { en: 'Car rental', es: 'Renta de auto' }, partner: 'Autos Rumbo', icon: 'car', baseCost: 2600, description: { en: 'Compact car with unlimited mileage and basic insurance.', es: 'Auto compacto con kilometraje libre y seguro básico.' } },
      { title: { en: 'Cabin in the Coffee Region', es: 'Cabaña en el Eje Cafetero' }, partner: 'Cabañas del Valle', icon: 'sunrise', baseCost: 3600, description: { en: 'A cabin among coffee fields with a valley view and a country breakfast.', es: 'Cabaña entre cafetales con vista al valle y desayuno campesino.' } },
      { title: { en: 'Machu Picchu tour', es: 'Tour por Machu Picchu' }, partner: 'Andes Tours', icon: 'mountain', baseCost: 18000, description: { en: 'Transfers, tickets and a bilingual guide to the Inca citadel.', es: 'Traslados, entradas y guía bilingüe a la ciudadela inca.' } },
      { title: { en: 'Eco lodge by the sea', es: 'Eco lodge frente al mar' }, partner: 'Ecolodge Arrecife', icon: 'tent-tree', baseCost: 5200, description: { en: 'An eco-cabin on the beach inside a national park.', es: 'Ecohábitat frente al mar dentro del parque natural.' } },
      { title: { en: 'International travel insurance', es: 'Seguro de viaje internacional' }, partner: 'Viaje Seguro', icon: 'shield-check', baseCost: 1200, description: { en: 'Medical and baggage cover for your next holiday.', es: 'Cobertura médica y de equipaje para tus próximas vacaciones.' } },
    ],
  },
  dining: {
    variants: [
      { label: { en: 'For 2', es: 'Para 2' }, costFactor: 1 },
      { label: { en: 'For 4', es: 'Para 4' }, costFactor: 1.7 },
      { label: { en: 'Tasting menu', es: 'Menú degustación' }, costFactor: 2.3 },
      { label: { en: 'With wine pairing', es: 'Con maridaje' }, costFactor: 2.9 },
    ],
    products: [
      { title: { en: "Chef's table dinner", es: 'Cena de autor' }, partner: 'Mesa de Autor', icon: 'utensils', baseCost: 3200, description: { en: "Signature cooking at one of the region's best-known tables.", es: 'Cocina de autor en una de las mesas más reconocidas de la región.' } },
      { title: { en: 'Sunday brunch', es: 'Brunch de domingo' }, partner: 'Terraza Alba', icon: 'croissant', baseCost: 1400, description: { en: 'All-you-can-eat buffet with mimosas and live music.', es: 'Buffet libre con mimosas y música en vivo.' } },
      { title: { en: 'Restaurant voucher', es: 'Bono de restaurante' }, partner: 'Crepería Luna', icon: 'sandwich', baseCost: 600, description: { en: 'A voucher you can use at any of their locations.', es: 'Bono canjeable en cualquiera de sus sedes del país.' } },
      { title: { en: 'Single-origin coffee tasting', es: 'Cata de café de origen' }, partner: 'Tostadores de Altura', icon: 'coffee', baseCost: 900, description: { en: 'A guided tasting of three coffees paired with desserts.', es: 'Cata guiada de tres cafés de origen con maridaje de postres.' } },
      { title: { en: 'Sushi night', es: 'Noche de sushi' }, partner: 'Sushi Kai', icon: 'fish', baseCost: 2600, description: { en: 'A reserved seat at the sushi bar with complimentary sake.', es: 'Mesa reservada con barra de sushi y sake de cortesía.' } },
      { title: { en: 'Cooking class', es: 'Clase de cocina' }, partner: 'Escuela Fogón', icon: 'chef-hat', baseCost: 2000, description: { en: 'A three-hour hands-on workshop with a guest chef.', es: 'Taller práctico de tres horas con un chef invitado.' } },
      { title: { en: 'Wine box', es: 'Caja de vinos' }, partner: 'Cava del Sur', icon: 'wine', baseCost: 2800, description: { en: 'Three labels from South American wineries.', es: 'Selección de tres etiquetas de bodegas sudamericanas.' } },
      { title: { en: 'Romantic dinner', es: 'Cena romántica' }, partner: 'Parrilla La Brasa', icon: 'flame', baseCost: 2400, description: { en: 'A private table with starter, main course and dessert.', es: 'Mesa privada con entrada, plato fuerte y postre.' } },
      { title: { en: 'Free delivery for a month', es: 'Domicilio gratis por un mes' }, partner: 'Envíos Ya', icon: 'bike', baseCost: 700, description: { en: 'No delivery fees on restaurant and grocery orders.', es: 'Envíos sin costo en pedidos de restaurantes y supermercados.' } },
      { title: { en: 'Artisan chocolates', es: 'Chocolates artesanales' }, partner: 'Cacao Nativo', icon: 'candy', baseCost: 800, description: { en: 'A box of twelve single-origin cacao bonbons.', es: 'Caja de doce bombones de cacao de origen único.' } },
    ],
  },
  tech: {
    variants: [
      { label: { en: 'Standard model', es: 'Modelo estándar' }, costFactor: 1 },
      { label: { en: 'Plus version', es: 'Versión Plus' }, costFactor: 1.4 },
      { label: { en: 'Pro version', es: 'Versión Pro' }, costFactor: 1.9 },
      { label: { en: 'Limited edition', es: 'Edición limitada' }, costFactor: 2.5 },
    ],
    products: [
      { title: { en: 'Wireless headphones', es: 'Audífonos inalámbricos' }, partner: 'SonicWave', icon: 'headphones', baseCost: 5200, description: { en: 'Active noise cancelling and up to 30 hours of battery.', es: 'Cancelación activa de ruido y hasta 30 horas de batería.' } },
      { title: { en: 'Sports smartwatch', es: 'Smartwatch deportivo' }, partner: 'PulseFit', icon: 'watch', baseCost: 8800, description: { en: 'Multi-band GPS, heart-rate tracking and training metrics.', es: 'GPS multibanda, monitoreo cardíaco y métricas de entrenamiento.' } },
      { title: { en: '11-inch tablet', es: 'Tablet de 11 pulgadas' }, partner: 'Pixel Tab', icon: 'tablet', baseCost: 11000, description: { en: 'AMOLED screen with a stylus included.', es: 'Pantalla AMOLED con lápiz digital incluido.' } },
      { title: { en: 'Bluetooth speaker', es: 'Parlante Bluetooth' }, partner: 'BoomBox', icon: 'speaker', baseCost: 3000, description: { en: 'Water resistant, with 12 hours of continuous playback.', es: 'Resistente al agua, con 12 horas de reproducción continua.' } },
      { title: { en: 'Action camera', es: 'Cámara de acción' }, partner: 'ActionCam', icon: 'camera', baseCost: 9500, description: { en: '5K video with stabilization and a waterproof housing.', es: 'Video 5K con estabilización y carcasa sumergible.' } },
      { title: { en: 'Mechanical keyboard', es: 'Teclado mecánico' }, partner: 'KeyCraft', icon: 'keyboard', baseCost: 3400, description: { en: 'Wireless, backlit and paired with several devices.', es: 'Inalámbrico, retroiluminado y compatible con varios dispositivos.' } },
      { title: { en: 'Power bank', es: 'Cargador portátil' }, partner: 'VoltGo', icon: 'battery-charging', baseCost: 1500, description: { en: 'Fast-charging battery for your phone and laptop.', es: 'Batería externa de carga rápida para celular y portátil.' } },
      { title: { en: 'Ultrawide monitor', es: 'Monitor ultrawide' }, partner: 'UltraView', icon: 'monitor', baseCost: 12500, description: { en: 'A curved 34-inch panel for work and entertainment.', es: 'Panel curvo de 34 pulgadas ideal para trabajo y entretenimiento.' } },
      { title: { en: 'Item tracker', es: 'Rastreador de objetos' }, partner: 'TagFinder', icon: 'map-pin', baseCost: 1100, description: { en: 'Find keys, luggage and more from your phone.', es: 'Localiza llaves, maletas y más desde tu celular.' } },
      { title: { en: 'Streaming subscription', es: 'Suscripción de streaming' }, partner: 'StreamPlus', icon: 'clapperboard', baseCost: 1800, description: { en: 'Six months of the ad-free standard plan.', es: 'Seis meses de plan estándar sin publicidad.' } },
    ],
  },
  experiences: {
    variants: [
      { label: { en: 'General admission', es: 'Entrada general' }, costFactor: 1 },
      { label: { en: 'For 2 people', es: 'Para 2 personas' }, costFactor: 1.8 },
      { label: { en: 'Preferred seating', es: 'Zona preferencial' }, costFactor: 2.2 },
      { label: { en: 'VIP experience', es: 'Experiencia VIP' }, costFactor: 3.1 },
    ],
    products: [
      { title: { en: 'Arena concert', es: 'Concierto en el arena' }, partner: 'Boletera Central', icon: 'mic', baseCost: 4200, description: { en: 'A ticket to the artist of your choice from the season line-up.', es: 'Entrada al concierto del artista de tu elección según programación.' } },
      { title: { en: 'Movie tickets', es: 'Entradas al cine' }, partner: 'Cines Estrella', icon: 'popcorn', baseCost: 500, description: { en: 'Tickets with popcorn and a soda in a standard theatre.', es: 'Combo de boletas con crispetas y gaseosa en sala tradicional.' } },
      { title: { en: 'Paragliding flight', es: 'Vuelo en parapente' }, partner: 'Parapente Cañón', icon: 'wind', baseCost: 3800, description: { en: 'A tandem flight over the canyon with a souvenir video.', es: 'Vuelo biplaza sobre el cañón con video de recuerdo.' } },
      { title: { en: 'Football match', es: 'Partido de fútbol' }, partner: 'Club Deportivo Local', icon: 'goal', baseCost: 1700, description: { en: 'A seat in the west stand of the stadium.', es: 'Entrada a tribuna occidental del estadio.' } },
      { title: { en: 'Hot-air balloon ride', es: 'Recorrido en globo' }, partner: 'Globos al Amanecer', icon: 'balloon', baseCost: 5600, description: { en: 'A sunrise balloon flight with a celebration breakfast.', es: 'Amanecer en globo aerostático con desayuno de celebración.' } },
      { title: { en: 'Theatre night', es: 'Noche de teatro' }, partner: 'Teatro Metropolitano', icon: 'drama', baseCost: 1300, description: { en: "A gala performance of the current season.", es: 'Función de gala de la temporada vigente.' } },
      { title: { en: 'Photography course', es: 'Curso de fotografía' }, partner: 'Academia Lente', icon: 'aperture', baseCost: 1600, description: { en: 'An online course with a certificate and lifetime access.', es: 'Curso en línea con certificado y acceso de por vida.' } },
      { title: { en: 'Scuba diving trip', es: 'Buceo en el Caribe' }, partner: 'Buceo Azul', icon: 'waves', baseCost: 4600, description: { en: 'A first dive with a certified instructor and full gear.', es: 'Bautizo de buceo con instructor certificado y equipo completo.' } },
      { title: { en: 'Guided museum visit', es: 'Visita a museo con guía' }, partner: 'Museo Nacional', icon: 'landmark', baseCost: 700, description: { en: 'A private tour of the main galleries.', es: 'Recorrido privado por las salas principales del museo.' } },
      { title: { en: 'Music festival', es: 'Festival de música' }, partner: 'Festival Sonar', icon: 'music', baseCost: 6800, description: { en: 'A three-day pass with access to the lounge area.', es: 'Abono de tres días al festival con acceso a zona de descanso.' } },
    ],
  },
  wellness: {
    variants: [
      { label: { en: 'Single session', es: 'Sesión individual' }, costFactor: 1 },
      { label: { en: 'For 2 people', es: 'Para 2 personas' }, costFactor: 1.8 },
      { label: { en: '4-session pack', es: 'Paquete de 4 sesiones' }, costFactor: 3 },
      { label: { en: 'Monthly program', es: 'Programa mensual' }, costFactor: 4.2 },
    ],
    products: [
      { title: { en: 'Relaxing massage', es: 'Masaje relajante' }, partner: 'Spa Serena', icon: 'hand-heart', baseCost: 1500, description: { en: 'A sixty-minute session with aromatherapy and welcome tea.', es: 'Sesión de sesenta minutos con aromaterapia y té de bienvenida.' } },
      { title: { en: 'Yoga class', es: 'Clase de yoga' }, partner: 'Estudio Prana', icon: 'person-standing', baseCost: 500, description: { en: 'A guided class for every level in a studio with a mountain view.', es: 'Clase guiada para todos los niveles en estudio con vista a los cerros.' } },
      { title: { en: 'Gym membership', es: 'Membresía de gimnasio' }, partner: 'Gimnasio Vital', icon: 'dumbbell', baseCost: 2200, description: { en: 'Access to every location, group classes and the spa area.', es: 'Acceso a todas las sedes, clases grupales y zona húmeda.' } },
      { title: { en: 'Hot springs circuit', es: 'Circuito de hidroterapia' }, partner: 'Termales del Volcán', icon: 'thermometer-sun', baseCost: 2000, description: { en: 'Entry to the thermal pools with a traditional lunch.', es: 'Ingreso a piscinas termales con almuerzo típico incluido.' } },
      { title: { en: 'Nutrition consultation', es: 'Consulta nutricional' }, partner: 'NutriPlan', icon: 'salad', baseCost: 1100, description: { en: 'A personal assessment and a four-week meal plan.', es: 'Evaluación personalizada y plan de alimentación por cuatro semanas.' } },
      { title: { en: 'Meditation subscription', es: 'Suscripción de meditación' }, partner: 'Mente Calma', icon: 'moon', baseCost: 900, description: { en: 'Guided meditations, sleep stories and relaxing music.', es: 'Meditaciones guiadas, historias para dormir y música relajante.' } },
      { title: { en: 'Executive health check', es: 'Chequeo médico ejecutivo' }, partner: 'Clínica Integral', icon: 'stethoscope', baseCost: 4400, description: { en: 'Lab tests, a cardiovascular check and a results consultation.', es: 'Exámenes de laboratorio, valoración cardiovascular y consulta de resultados.' } },
      { title: { en: 'Pilates class', es: 'Clase de pilates' }, partner: 'Reformer Studio', icon: 'flower', baseCost: 800, description: { en: 'A reformer session with a certified instructor.', es: 'Sesión en máquina reformer con instructor certificado.' } },
      { title: { en: 'Wellness retreat', es: 'Retiro de bienestar' }, partner: 'Retiros Raíz', icon: 'leaf', baseCost: 7200, description: { en: 'A weekend to unplug, with yoga, spa and healthy food.', es: 'Fin de semana de desconexión con yoga, spa y alimentación saludable.' } },
      { title: { en: 'Therapy session', es: 'Terapia psicológica' }, partner: 'Terapia en Línea', icon: 'brain', baseCost: 1300, description: { en: 'An online session with a verified psychologist, at a time you choose.', es: 'Sesión virtual con psicólogo verificado, en el horario que elijas.' } },
    ],
  },
};

const SEED = 20260930;
const ROUND_TO = 50;
const MIN_COST = 300;
const MAX_COST = 30_000;

/**
 * Deterministic: 5 categories x 10 products x 4 variants = 200 rewards, identical on every run.
 * Ids, costs and stock do not depend on the language: only the text does.
 */
export function buildRewards(language: MockLanguage = 'en'): Reward[] {
  const random = seededRandom(SEED);
  const rewards: Reward[] = [];
  let sequence = 0;

  for (const [category, spec] of Object.entries(CATALOG) as [RewardCategory, CategorySpec][]) {
    for (const product of spec.products) {
      for (const variant of spec.variants) {
        sequence += 1;
        const jitter = 0.92 + random() * 0.16;
        const raw = product.baseCost * variant.costFactor * jitter;
        const costPoints = Math.min(MAX_COST, Math.max(MIN_COST, Math.round(raw / ROUND_TO) * ROUND_TO));
        const limited = random() < 0.3;
        rewards.push({
          id: `rw-${String(sequence).padStart(3, '0')}`,
          title: `${product.title[language]} - ${variant.label[language]}`,
          partner: product.partner,
          category,
          costPoints,
          description: product.description[language],
          icon: product.icon,
          ...(limited ? { stock: 1 + Math.floor(random() * 24) } : {}),
        });
      }
    }
  }

  // Interleave categories so the "all" view is not five long blocks of the same thing.
  return rewards.sort((a, b) => hash(a.id) - hash(b.id));
}

function hash(id: string): number {
  return (Number(id.slice(3)) * 2654435761) % 4294967296;
}
