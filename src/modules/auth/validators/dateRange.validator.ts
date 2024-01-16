import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'beforeDate', async: false })
export class BeforeDateValidator implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const dateToCompare: Date = new Date(args.constraints[0]);
    const selectedDate: Date = new Date(value);

    return selectedDate < dateToCompare;
  }

  defaultMessage(args: ValidationArguments) {
    const dateToCompare: Date = new Date(args.constraints[0]);
    const { property } = args;
    return `The ${
      property == 'birth_date' ? 'Date of birth' : property
    } must be before ${dateToCompare.toLocaleDateString()}`;
  }
}
