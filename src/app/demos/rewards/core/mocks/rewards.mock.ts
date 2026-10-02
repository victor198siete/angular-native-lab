import type { Reward, RewardCategory, RewardIcon } from '../models/index.ts';
import { seededRandom } from './seeded-random.ts';

interface Product {
  readonly title: string;
  readonly partner: string;
  readonly icon: RewardIcon;
  readonly baseCost: number;
  readonly description: string;
}

interface Variant {
  readonly label: string;
  readonly costFactor: number;
}

interface CategorySpec {
  readonly products: readonly Product[];
  readonly variants: readonly Variant[];
}

const CATALOG: Record<RewardCategory, CategorySpec> = {
  Viajes: {
    variants: [
      { label: 'Fin de semana', costFactor: 1 },
      { label: 'Para 2 personas', costFactor: 1.8 },
      { label: 'Semana completa', costFactor: 2.6 },
      { label: 'Edición premium', costFactor: 3.4 },
    ],
    products: [
      { title: 'Escapada a Cartagena', partner: 'Aerolínea Cóndor', icon: 'palmtree', baseCost: 9000, description: 'Vuelo directo e impuestos incluidos hacia la ciudad amurallada.' },
      { title: 'Hotel boutique en Medellín', partner: 'Hoteles Brisa', icon: 'hotel', baseCost: 4200, description: 'Noches de alojamiento con desayuno buffet en El Poblado.' },
      { title: 'Vuelo a Ciudad de México', partner: 'Vuelos Quetzal', icon: 'plane', baseCost: 14000, description: 'Tiquete de ida y vuelta en clase turista con equipaje de bodega.' },
      { title: 'Pase de sala VIP', partner: 'Salas Altitud', icon: 'armchair', baseCost: 1800, description: 'Acceso a salas VIP en más de 1.400 aeropuertos del mundo.' },
      { title: 'Crucero por el Caribe', partner: 'Cruceros Coral', icon: 'ship', baseCost: 22000, description: 'Itinerario de siete días con pensión completa a bordo.' },
      { title: 'Renta de auto', partner: 'Autos Rumbo', icon: 'car', baseCost: 2600, description: 'Auto compacto con kilometraje libre y seguro básico.' },
      { title: 'Cabaña en el Eje Cafetero', partner: 'Cabañas del Valle', icon: 'sunrise', baseCost: 3600, description: 'Cabaña entre cafetales con vista al valle y desayuno campesino.' },
      { title: 'Tour por Machu Picchu', partner: 'Andes Tours', icon: 'mountain', baseCost: 18000, description: 'Traslados, entradas y guía bilingüe a la ciudadela inca.' },
      { title: 'Eco lodge en el Tayrona', partner: 'Ecolodge Arrecife', icon: 'tent-tree', baseCost: 5200, description: 'Ecohábitat frente al mar dentro del parque natural.' },
      { title: 'Seguro de viaje internacional', partner: 'Viaje Seguro', icon: 'shield-check', baseCost: 1200, description: 'Cobertura médica y de equipaje para tus próximas vacaciones.' },
    ],
  },
  Gastronomía: {
    variants: [
      { label: 'Para 2', costFactor: 1 },
      { label: 'Para 4', costFactor: 1.7 },
      { label: 'Menú degustación', costFactor: 2.3 },
      { label: 'Con maridaje', costFactor: 2.9 },
    ],
    products: [
      { title: 'Cena de autor', partner: 'Mesa de Autor', icon: 'utensils', baseCost: 3200, description: 'Cocina colombiana de autor en una de las mesas más reconocidas de Latinoamérica.' },
      { title: 'Brunch de domingo', partner: 'Terraza Alba', icon: 'croissant', baseCost: 1400, description: 'Buffet libre con mimosas y música en vivo.' },
      { title: 'Bono de restaurante', partner: 'Crepería Luna', icon: 'sandwich', baseCost: 600, description: 'Bono canjeable en cualquiera de sus sedes del país.' },
      { title: 'Cata de café de origen', partner: 'Tostadores de Altura', icon: 'coffee', baseCost: 900, description: 'Cata guiada de tres cafés de origen con maridaje de postres.' },
      { title: 'Noche de sushi', partner: 'Sushi Kai', icon: 'fish', baseCost: 2600, description: 'Mesa reservada con barra de sushi y sake de cortesía.' },
      { title: 'Clase de cocina', partner: 'Escuela Fogón', icon: 'chef-hat', baseCost: 2000, description: 'Taller práctico de tres horas con un chef invitado.' },
      { title: 'Caja de vinos', partner: 'Cava del Sur', icon: 'wine', baseCost: 2800, description: 'Selección de tres etiquetas de bodegas argentinas y chilenas.' },
      { title: 'Cena romántica', partner: 'Parrilla La Brasa', icon: 'flame', baseCost: 2400, description: 'Mesa privada con entrada, plato fuerte y postre.' },
      { title: 'Domicilio gratis por un mes', partner: 'Envíos Ya', icon: 'bike', baseCost: 700, description: 'Envíos sin costo en pedidos de restaurantes y supermercados.' },
      { title: 'Chocolates artesanales', partner: 'Cacao Nativo', icon: 'candy', baseCost: 800, description: 'Caja de doce bombones de cacao colombiano de origen único.' },
    ],
  },
  Tecnología: {
    variants: [
      { label: 'Modelo estándar', costFactor: 1 },
      { label: 'Versión Plus', costFactor: 1.4 },
      { label: 'Versión Pro', costFactor: 1.9 },
      { label: 'Edición limitada', costFactor: 2.5 },
    ],
    products: [
      { title: 'Audífonos inalámbricos', partner: 'SonicWave', icon: 'headphones', baseCost: 5200, description: 'Cancelación activa de ruido y hasta 30 horas de batería.' },
      { title: 'Smartwatch deportivo', partner: 'PulseFit', icon: 'watch', baseCost: 8800, description: 'GPS multibanda, monitoreo cardíaco y métricas de entrenamiento.' },
      { title: 'Tablet de 11 pulgadas', partner: 'Pixel Tab', icon: 'tablet', baseCost: 11000, description: 'Pantalla AMOLED con lápiz digital incluido.' },
      { title: 'Parlante Bluetooth', partner: 'BoomBox', icon: 'speaker', baseCost: 3000, description: 'Resistente al agua, con 12 horas de reproducción continua.' },
      { title: 'Cámara de acción', partner: 'ActionCam', icon: 'camera', baseCost: 9500, description: 'Video 5K con estabilización y carcasa sumergible.' },
      { title: 'Teclado mecánico', partner: 'KeyCraft', icon: 'keyboard', baseCost: 3400, description: 'Inalámbrico, retroiluminado y compatible con varios dispositivos.' },
      { title: 'Cargador portátil', partner: 'VoltGo', icon: 'battery-charging', baseCost: 1500, description: 'Batería externa de carga rápida para celular y portátil.' },
      { title: 'Monitor ultrawide', partner: 'UltraView', icon: 'monitor', baseCost: 12500, description: 'Panel curvo de 34 pulgadas ideal para trabajo y entretenimiento.' },
      { title: 'Rastreador de objetos', partner: 'TagFinder', icon: 'map-pin', baseCost: 1100, description: 'Localiza llaves, maletas y más desde tu celular.' },
      { title: 'Suscripción de streaming', partner: 'StreamPlus', icon: 'clapperboard', baseCost: 1800, description: 'Seis meses de plan estándar sin publicidad.' },
    ],
  },
  Experiencias: {
    variants: [
      { label: 'Entrada general', costFactor: 1 },
      { label: 'Para 2 personas', costFactor: 1.8 },
      { label: 'Zona preferencial', costFactor: 2.2 },
      { label: 'Experiencia VIP', costFactor: 3.1 },
    ],
    products: [
      { title: 'Concierto en el arena', partner: 'Boletera Central', icon: 'mic', baseCost: 4200, description: 'Entrada al concierto del artista de tu elección según programación.' },
      { title: 'Entradas al cine', partner: 'Cines Estrella', icon: 'popcorn', baseCost: 500, description: 'Combo de boletas con crispetas y gaseosa en sala tradicional.' },
      { title: 'Vuelo en parapente', partner: 'Parapente Cañón', icon: 'wind', baseCost: 3800, description: 'Vuelo biplaza sobre el cañón con video de recuerdo.' },
      { title: 'Partido de fútbol', partner: 'Club Deportivo Local', icon: 'goal', baseCost: 1700, description: 'Entrada a tribuna occidental del estadio.' },
      { title: 'Recorrido en globo', partner: 'Globos al Amanecer', icon: 'balloon', baseCost: 5600, description: 'Amanecer en globo aerostático con desayuno de celebración.' },
      { title: 'Noche de teatro', partner: 'Teatro Metropolitano', icon: 'drama', baseCost: 1300, description: 'Función de gala de la temporada vigente.' },
      { title: 'Curso de fotografía', partner: 'Academia Lente', icon: 'aperture', baseCost: 1600, description: 'Curso en línea con certificado y acceso de por vida.' },
      { title: 'Buceo en San Andrés', partner: 'Buceo Azul', icon: 'waves', baseCost: 4600, description: 'Bautizo de buceo con instructor certificado y equipo completo.' },
      { title: 'Visita a museo con guía', partner: 'Museo Nacional', icon: 'landmark', baseCost: 700, description: 'Recorrido privado por las salas principales del museo.' },
      { title: 'Festival de música', partner: 'Festival Sonar', icon: 'music', baseCost: 6800, description: 'Abono de tres días al festival con acceso a zona de descanso.' },
    ],
  },
  Bienestar: {
    variants: [
      { label: 'Sesión individual', costFactor: 1 },
      { label: 'Para 2 personas', costFactor: 1.8 },
      { label: 'Paquete de 4 sesiones', costFactor: 3 },
      { label: 'Programa mensual', costFactor: 4.2 },
    ],
    products: [
      { title: 'Masaje relajante', partner: 'Spa Serena', icon: 'hand-heart', baseCost: 1500, description: 'Sesión de sesenta minutos con aromaterapia y té de bienvenida.' },
      { title: 'Clase de yoga', partner: 'Estudio Prana', icon: 'person-standing', baseCost: 500, description: 'Clase guiada para todos los niveles en estudio con vista a los cerros.' },
      { title: 'Membresía de gimnasio', partner: 'Gimnasio Vital', icon: 'dumbbell', baseCost: 2200, description: 'Acceso a todas las sedes, clases grupales y zona húmeda.' },
      { title: 'Circuito de hidroterapia', partner: 'Termales del Volcán', icon: 'thermometer-sun', baseCost: 2000, description: 'Ingreso a piscinas termales con almuerzo típico incluido.' },
      { title: 'Consulta nutricional', partner: 'NutriPlan', icon: 'salad', baseCost: 1100, description: 'Evaluación personalizada y plan de alimentación por cuatro semanas.' },
      { title: 'Suscripción de meditación', partner: 'Mente Calma', icon: 'moon', baseCost: 900, description: 'Meditaciones guiadas, historias para dormir y música relajante.' },
      { title: 'Chequeo médico ejecutivo', partner: 'Clínica Integral', icon: 'stethoscope', baseCost: 4400, description: 'Exámenes de laboratorio, valoración cardiovascular y consulta de resultados.' },
      { title: 'Clase de pilates', partner: 'Reformer Studio', icon: 'flower', baseCost: 800, description: 'Sesión en máquina reformer con instructor certificado.' },
      { title: 'Retiro de bienestar', partner: 'Retiros Raíz', icon: 'leaf', baseCost: 7200, description: 'Fin de semana de desconexión con yoga, spa y alimentación saludable.' },
      { title: 'Terapia psicológica', partner: 'Terapia en Línea', icon: 'brain', baseCost: 1300, description: 'Sesión virtual con psicólogo verificado, en el horario que elijas.' },
    ],
  },
};

const SEED = 20260930;
const ROUND_TO = 50;
const MIN_COST = 300;
const MAX_COST = 30_000;

/** Deterministic: 5 categories x 10 products x 4 variants = 200 rewards, identical on every run. */
export function buildRewards(): Reward[] {
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
          title: `${product.title} - ${variant.label}`,
          partner: product.partner,
          category,
          costPoints,
          description: product.description,
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

export const MOCK_REWARDS: readonly Reward[] = buildRewards();
