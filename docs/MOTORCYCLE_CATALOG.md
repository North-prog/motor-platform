# Motorcycle catalogue

## Discovery paths

The customer can find a motorcycle in either of two ways:

1. **By manufacturer:** manufacturer/brand → model → variant.
2. **By scooter style:** scooter family → manufacturer → model → variant.

These paths resolve to the same model and variant records. They must not create duplicate motorcycles or imply parts compatibility.

## Scooter families

- `click-style`: Click-style step-through scooters.
- `classic-scooter`: classic/Vespa-style scooters.
- `city-scooter`: compact city scooters.
- `sport-scooter`: sporty automatic scooters.
- `maxi-scooter`: larger touring/comfort scooters.
- `adventure-scooter`: crossover/adventure-style scooters.

## Initial pilot catalogue

The first seed is scooter-first and contains 31 model records across Honda, Kavir, Niroo Motor/Galaxy, Kabir, Dino, Hamtaz, Blenta, TVS, Yamaha and Daichi.

The initial variant named "Standard" is a catalogue placeholder, not a claim that all production years or trims are identical. Before using a variant to recommend or sell a part, confirm the exact model year, trim, engine, brake system and part fitment.

## Data quality rules

- A locally manufactured clone remains under its actual manufacturer. Its visual family (for example `click-style`) is a discovery label only.
- Similar appearance does not prove mechanical or electrical compatibility.
- Do not infer ABS/CBS, fuel injection, cooling type, production year, or generation from a model name.
- Keep unknown attributes empty until verified from a manufacturer/importer catalogue or a physical sample.
- Model photos and 3D assets must be exact to the model/variant; do not reuse a generic scooter image as if it were an exact match.
- Add models only after confirming that the model is sold in Iran or has meaningful local service/parts demand.

## Migration

Apply `database/migrations/0002_scooter_first_catalog.sql` after `0001_initial.sql`.
