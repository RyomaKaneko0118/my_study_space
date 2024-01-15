@use '../../global' as var;

.p-dx {
  &__training {
    width: 100%;

    &__wrapper {
      width: 100%;
      margin-top: 112px;
      padding: 0 20px;

      &__header {
        h2 {
          text-align: center;
          color: var.$color-black;
          font-weight: var.$font-weight-bold;
          font-size: 36px;
        }
      }

      &__content {
        margin-top: 50px;
        width: 100%;
        max-width: 1220px; 
        // gap: 10px;

        table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 1;
          font-size: 16px;
          font-weight: var.$font-weight-bold;
          color: var.$color-white !important;
  
          th {
            padding: 19px 10px 19px 20px;
            text-align: left;
            background-color: #346099;

            &:first-child {
              width: 71px;
              padding: 11px 0px;
              writing-mode: vertical-lr;
              text-align: center;
              background: linear-gradient(
                var.$color-gradation1 10%,
                var.$color-gradation2 90%
              );
              font-size: 18px;
              font-weight: var.$font-weight-bold;
            }
  
            &:nth-child(2) {
              width: 89px;
            }

            &:nth-child(4) {
              width: 436px;
            }

            &.background-dark-blue {
              background-color: #002D6D;
            }

            &.background-light-blue {
              background-color: #4F83C8;
            }
          }
          
          td {
            padding: 20px 10px 20px 20px;
            text-align: left;
            background-color: var.$color-background;
            font-weight: var.$font-weight-bold;
            color: #356099;
          } 
        }
      }
    } 
  }
}

