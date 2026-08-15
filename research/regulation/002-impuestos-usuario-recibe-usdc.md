# Impuestos argentinos cuando un usuario recibe USDC

- **ID:** `regulation-002`
- **Estado:** `in-progress`
- **Fecha:** `2026-08-15`
- **Área:** regulación fiscal

## Advertencia

Este documento es una investigación de producto y no asesoramiento impositivo. El tratamiento final depende de la residencia fiscal, actividad, habitualidad, documentación, volumen, origen de fondos y estructura de la operación. Antes de operar dinero real se debe consultar a un contador y a un abogado tributario argentino.

## Respuesta corta

**Recibir USDC no genera automáticamente Impuesto a las Ganancias.** Depende de por qué se recibe:

| Situación | Tratamiento probable |
|---|---|
| Usuario compra USDC con sus propios ARS | No hay ganancia por la compra; adquiere un activo y debe conservar respaldo de costo y origen |
| Usuario recibe USDC como pago por un bien o servicio | Es un ingreso de la actividad, valuado en pesos al momento de la operación; corresponde facturar y declarar según el régimen |
| Usuario recibe USDC por una devolución, préstamo o transferencia propia | No es automáticamente renta, pero debe poder probarse el concepto y origen |
| Usuario vende, permuta o usa USDC después | Puede existir una ganancia gravada por la disposición, calculada contra el costo documentado |
| Usuario mantiene USDC al 31 de diciembre | Debe analizarse su inclusión en Bienes Personales; no existe una regla específica clara para USDC |

## 1. Compra de ARS y recepción de USDC

Si una persona paga ARS para comprar USDC, la operación es, en principio, una adquisición de un activo y no una renta. No debería pagar Ganancias sólo por recibir el USDC.

Debe conservar:

- comprobante de la compra;
- cantidad de USDC;
- cotización y fecha;
- comisiones;
- exchange o proveedor;
- wallet de destino;
- origen de los ARS.

La situación cambia cuando el USDC se vende, permuta o se utiliza para cancelar una compra: esa disposición puede generar un resultado imponible.

## 2. Recibir USDC por vender bienes o prestar servicios

El pago en USDC no elimina la venta ni cambia automáticamente la base fiscal. El proveedor debería:

1. emitir el comprobante correspondiente;
2. determinar el valor de la operación en ARS de forma documentable;
3. registrar el USDC recibido como activo al valor de la operación;
4. separar la venta del resultado posterior por tenencia o conversión del USDC.

Ejemplo conceptual:

```text
Servicio vendido: valor ARS al momento de cobro
USDC recibido: medio de cancelación y activo recibido
Venta posterior del USDC: posible resultado adicional
```

Para un monotributista, cobrar USDC no elimina el ingreso bruto ni la obligación de facturar. El Monotributo unifica IVA, Ganancias y aportes, pero no convierte el cobro crypto en no alcanzado.

## 3. Ganancias por venta o conversión posterior

La Ley de Impuesto a las Ganancias incluye expresamente los resultados de la enajenación de “monedas digitales”. La Ley 27.430 modificó:

- artículo 2, inciso 4: resultados derivados de la enajenación de monedas digitales;
- artículo 45, inciso k: resultados de operaciones de enajenación de monedas digitales;
- artículo 19: quebrantos específicos para determinadas inversiones y operaciones.

Por eso no debe asumirse que una ganancia realizada con USDC está exenta sólo porque USDC es una stablecoin.

La determinación requiere documentar:

- costo de adquisición o valor de ingreso;
- fecha y cantidad;
- valor en ARS al recibirlo;
- valor en ARS al venderlo o permutarlo;
- comisiones;
- cotización utilizada;
- si la operación forma parte de una actividad habitual.

La mera tenencia, sin disposición, es más discutible para Ganancias, pero sigue siendo relevante para el patrimonio y para justificar origen y evolución de fondos.

## 4. IVA

El uso de USDC como medio de pago no vuelve exenta la operación subyacente.

- Venta de un bien: se analiza IVA sobre la venta según el bien y condición del vendedor.
- Prestación de un servicio: se analiza IVA según el servicio y condición fiscal.
- Comisión de ArcPOS o del proveedor de conversión: puede constituir un servicio alcanzado.
- Simple adquisición personal de USDC: no equivale automáticamente a una venta de bienes o servicio gravado por IVA.

No se encontró una norma general de ARCA que establezca un tratamiento específico y completo para la compraventa de USDC en IVA.

## 5. Bienes Personales

El saldo de USDC mantenido al 31 de diciembre debe analizarse como parte del patrimonio. La existencia de paridad aproximada con el dólar no elimina automáticamente la obligación de analizarlo.

Persisten dudas sobre:

- si corresponde tratarlo como moneda digital, activo financiero, intangible o crédito;
- si está situado en Argentina o en el exterior cuando está en una wallet propia;
- qué método de valuación específico aplicar.

La app debería permitir descargar un reporte anual con saldos, fechas, wallets, exchange, valor y TXIDs para que el contribuyente pueda entregarlo a su contador.

## 6. Impacto para ArcPOS

ArcPOS no debe prometer al usuario “pago sin impuestos”. La interfaz debe mostrar una leyenda neutral:

> El tratamiento fiscal depende del motivo por el que recibís o utilizás USDC y de tu situación tributaria. Conservá comprobantes y consultá a un profesional.

El sistema debe registrar:

- importe original en ARS;
- USDC entregado o recibido;
- cotización y fuente;
- fecha y hora;
- comisiones y spread;
- tipo de operación;
- comprobante fiscal;
- wallet y red;
- TXID;
- proveedor que realizó la conversión.

ArcPOS debería entregar reportes, no determinar automáticamente el impuesto del usuario.

## Casos de producto

### Usuario compra USDC con ARS

```text
ARS debitados -> proveedor convierte -> USDC recibido
```

No tratar como ingreso. Guardar costo y origen.

### Usuario compra un producto y el comercio recibe USDC

El usuario no necesariamente tiene una renta por pagar. El comercio registra la venta y el valor del cobro. El tratamiento del usuario puede involucrar consumo personal, no una ganancia, salvo que la operación tenga otra finalidad.

### Comercio recibe USDC por una venta

Registrar la venta en ARS, emitir factura y analizar IVA/Ganancias. La conversión posterior puede producir un resultado separado.

### Usuario recibe USDC por prestar un servicio

Registrar ingreso por el valor en ARS de la contraprestación, facturar y declarar según Ganancias, IVA o Monotributo.

## Conclusión para el MVP

El flujo ARS→USDC no debe trasladar al usuario la responsabilidad de entender blockchain, pero sí debe generar documentación fiscal suficiente. La plataforma debe:

- tratar el pago en ARS y la entrega de USDC como eventos separados;
- informar el valor ARS y el valor USDC;
- no afirmar que comprar USDC genera impuesto inmediato;
- no afirmar que recibir USDC está exento;
- recomendar asesoramiento para ingresos, ventas posteriores y Bienes Personales;
- hacer que el proveedor PSAV asuma la conversión y sus obligaciones de compliance;
- generar exportación contable y fiscal por operación y por año.

## Preguntas que debe responder el asesor fiscal

- ¿Qué cotización de USDC/ARS debe utilizarse para facturación?
- ¿La fecha fiscal es la autorización, acreditación ARS, conversión o entrega USDC?
- ¿Cómo se trata la diferencia entre valor de la venta y conversión posterior?
- ¿Cómo se valúa USDC en Bienes Personales?
- ¿Cómo se determina la fuente si el proveedor, wallet o emisor está fuera del país?
- ¿Qué régimen de información aplica a PSP, PSAV y exchanges?
- ¿Qué reportes debe emitir ArcPOS al comercio y al usuario?

## Fuentes oficiales

- [Ley 27.430, texto actualizado](https://www.argentina.gob.ar/normativa/nacional/ley-27430-305262/actualizacion) - artículos 2, 7, 19 y 45; consultado: `2026-08-15`.
- [ARCA - Bienes Personales](https://www.arca.gob.ar/gananciasYBienes/bienes-personales/) - consultado: `2026-08-15`.
- [ARCA - Conceptos básicos de Bienes Personales](https://www.arca.gob.ar/gananciasYBienes/bienes-personales/conceptos-basicos/) - consultado: `2026-08-15`.
- [ARCA - Monotributo](https://www.arca.gob.ar/monotributo/) - consultado: `2026-08-15`.
- [ARCA - IVA](https://www.arca.gob.ar/iva/) - consultado: `2026-08-15`.
- [CNV - Resolución General 1058/2025](https://www.argentina.gob.ar/normativa/nacional/resoluci%C3%B3n-1058-2025-410635/texto) - contexto PSAV; consultado: `2026-08-15`.
