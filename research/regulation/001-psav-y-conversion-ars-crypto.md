# Regulación argentina: conversión ARS, transferencia y custodia cripto

- **ID:** `regulation-001`
- **Estado:** `in-progress`
- **Fecha:** `2026-08-15`
- **Área:** regulación y compliance

## Advertencia

Este documento es research de producto y no constituye asesoramiento legal. Antes de operar dinero real se necesita opinión de abogados argentinos especializados en pagos, activos virtuales, prevención de lavado, impuestos y protección al consumidor.

## Hechos regulatorios principales

La Resolución General CNV 1058/2025 define como actividades de un Proveedor de Servicios de Activos Virtuales (PSAV), entre otras:

- intercambio entre activos virtuales y moneda fiduciaria;
- intercambio entre activos virtuales;
- transferencia de activos virtuales;
- custodia o administración de activos virtuales;
- servicios financieros vinculados con la oferta o venta de activos virtuales.

La norma exige inscripción previa para personas humanas residentes y personas jurídicas argentinas que realicen actividades alcanzadas, con categorías específicas y requisitos operativos.

La norma también excluye, entre otros casos:

- operar para sí mismo;
- recibir o entregar activos virtuales como contraprestación por productos o servicios propios;
- protocolos descentralizados sin proveedor identificable;
- proveedores exclusivamente de wallets de autocustodia.

La excepción de recibir crypto como pago por el propio servicio no debe interpretarse como permiso para intermediar conversiones o custodiar fondos de terceros.

## Impacto en ArcPOS

El flujo propuesto puede involucrar varias categorías:

```text
Cobrar ARS por cuenta de terceros       -> revisar rol PSP/pagos
Convertir ARS a USDC para terceros     -> posible PSAV categoría 1
Transferir USDC a una wallet            -> posible PSAV categoría 3
Custodiar USDC del comercio             -> posible PSAV categoría 4
```

La estructura más prudente para el MVP es:

1. PSP argentino cobra y acredita ARS.
2. PSAV registrado o proveedor B2B ejecuta la conversión.
3. El PSAV o proveedor envía USDC directamente a la wallet del comercio.
4. ArcPOS registra estados, fees y TXID sin custodiar ni disponer de fondos.

Esto no elimina la necesidad de revisión legal: ArcPOS podría seguir siendo considerado intermediario si fija la cotización, ordena la conversión o actúa en nombre de los usuarios.

## Custodia y wallets

Si ArcPOS controla wallets de comercios o usuarios, administra claves o mantiene saldos agrupados, aumenta el riesgo de caer en custodia. La regulación exige para custodios separación de activos, políticas de seguridad, información de wallets, controles de acceso y trazabilidad.

Para el prototipo:

- no guardar claves privadas en la API;
- no mantener saldos internos convertibles en crypto;
- no mezclar fondos propios y de clientes;
- usar direcciones explícitas y whitelistadas;
- registrar el consentimiento y la cotización;
- separar ledger interno de fondos on-chain;
- usar testnet y datos ficticios hasta cerrar el modelo legal.

## Datos, fraude y reclamos

El sistema debe contemplar:

- KYC/KYB del comercio a través del partner responsable;
- AML y screening de wallets cuando corresponda;
- trazabilidad de usuario, orden, cotización y TXID;
- tratamiento de pagos ARS rechazados o duplicados;
- pagos crypto irreversibles;
- política de reembolsos;
- protección de datos personales;
- facturación e impuestos sobre el precio de la venta en ARS.

## Conclusión

ArcPOS no debería comenzar como exchange, custodio ni emisor. Debe empezar como software de checkout, orquestación y conciliación conectado a un PSP y un PSAV/partner. La conversión automática ARS→USDC sólo debe pasar a producción cuando el partner asuma explícitamente la función regulada y el contrato defina responsabilidades.

## Preguntas para abogados y partners

- ¿ArcPOS es un proveedor tecnológico o realiza una actividad PSAV al mostrar una cotización y ordenar la conversión?
- ¿Quién es el vendedor de USDC frente al usuario o comercio?
- ¿Quién recibe temporalmente los ARS?
- ¿Quién custodia USDC durante la liquidación?
- ¿Qué categoría PSAV aplica al partner y qué tareas puede delegar?
- ¿Cómo se documenta la venta, el tipo de cambio, el spread y el impuesto?
- ¿Qué ocurre ante un pago ARS confirmado pero una conversión crypto fallida?
- ¿Qué datos deben conservarse y por cuánto tiempo?

## Fuentes

- [CNV - Resolución General 1058/2025](https://www.argentina.gob.ar/normativa/nacional/resoluci%C3%B3n-1058-2025-410635/texto) - consultado: `2026-08-15`.
- [CNV - Registro de PSAV](https://www.argentina.gob.ar/cnv/registro-de-proveedores-de-servicios-de-activos-virtuales) - consultado: `2026-08-15`.
- [BCRA - Transferencias 3.0](https://www.bcra.gob.ar/medios-de-pago/transferencias-3-0/) - consultado: `2026-08-15`.
- [Ripio - avisos regulatorios y PSAV](https://www.ripio.com/ar/) - consultado: `2026-08-15`.
