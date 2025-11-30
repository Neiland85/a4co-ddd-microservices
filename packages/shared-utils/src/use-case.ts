/**
 * Base use case interface for all use cases
 * Represents a single use case in the application layer
 */
export interface UseCase<Input = void, Output = void> {
    execute(input: Input): Promise<Output> | Output;
}

/**
 * Abstract class for use cases
 */
export abstract class AbstractUseCase<Input = void, Output = void> implements UseCase<Input, Output> {
    abstract execute(input: Input): Promise<Output> | Output;
}
