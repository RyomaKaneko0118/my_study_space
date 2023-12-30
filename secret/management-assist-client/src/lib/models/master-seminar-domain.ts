import { Lecturer } from '$lib/models'

export class MasterSeminarDomain {
  public readonly id!: number
  public readonly name!: string
  public lecturers: Lecturer[] = []

  constructor(init: Partial<MasterSeminarDomain>) {
    const { lecturers, ...attr } = init
    Object.assign(this, attr)

    if (lecturers) {
      this.lecturers = lecturers.map((lecturer) => new Lecturer(lecturer))
    }
  }
}
