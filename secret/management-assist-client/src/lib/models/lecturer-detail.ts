import { Lecturer, LecturerFee } from '$lib/models'

export class LecturerDetail {
  public readonly id!: number
  public readonly lecturerId!: number
  public readonly current!: boolean
  public readonly financialYear!: number
  public lecturer?: Lecturer
  public lecturerFees: LecturerFee[] = []

  constructor(init: Partial<LecturerDetail>) {
    const { lecturer, lecturerFees, ...attr } = init
    Object.assign(this, attr)

    if (lecturer) {
      this.lecturer = new Lecturer(lecturer)
    }

    if (lecturerFees) {
      this.lecturerFees = lecturerFees.map(
        (lecturerFee) => new LecturerFee(lecturerFee)
      )
    }
  }
}
