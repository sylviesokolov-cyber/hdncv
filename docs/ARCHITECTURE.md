# Initial implementation architecture

M0/M1 establishes a deliberately small vertical slice.

- `src/simulation/core` contains deterministic state, RNG, lifecycle and reproduction primitives.
- React only renders state and dispatches commands.
- Founder genetics is represented as explicit provenance IDs, not hidden stat bonuses.
- The next implementation slices should extract genetics, relationships, needs and reproduction into dedicated modules as their rules become substantial.
- The simulation state is serializable and versioned from the first implementation.
- Heavy simulation should remain tick-based; a worker is deferred until profiling justifies it.

- M3 reproduction models pregnancy as serializable citizen state; conception creates a due tick and the simulation resolves births during advance().
