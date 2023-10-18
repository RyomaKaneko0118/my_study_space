trainingClassifications: {
  createMany: {
    data: result.trainingClassifications.map(
      (trainingClassification) => {
        return {
          departmentId: trainingClassification.departmentId,
          contractId: trainingClassification.contractId,
          type: trainingClassification.type,
          trainingDays: trainingClassification.trainingDays,
          sales: trainingClassification.sales,
          note: trainingClassification.note,
          trainingClassificationCoordinators: {
            createMany: {
              data: trainingClassification.trainingClassificationCoordinators.map(
                (coordinator) => {
                  return {
                    coordinatorId: coordinator.coordinatorId,
                    role: coordinator.role
                  }
                }
              )
            }
          },
          trainingClassificationManagers: {
            createMany: {
              data: trainingClassification.trainingClassificationManagers.map(
                (manager) => {
                  return {
                    managerId: manager.managerId,
                    role: manager.role
                  }
                }
              )
            }
          }
        }
      }
    )
  }
}