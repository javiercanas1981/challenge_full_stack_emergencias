export interface IMapper<D, E> {
  toDomain(dto: D): E;
  toDTO(entity: E): D;
}
