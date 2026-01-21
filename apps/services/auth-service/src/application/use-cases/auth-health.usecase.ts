export class AuthHealthUseCase {
  execute() {
    return { status: 'ok', service: 'auth' };
  }
}
