import moment from 'moment'

export function isRequired(value) {
  return value === undefined || value === '' || value == null;
};

export function isDate(value) {
  if (value) {
    let isValid = /(\d{4})-(\d{2})-(\d{2})/.test(value) && moment(value, "YYYY-MM-DD").isValid();
    return isValid ? true : "Invalid date";
  } else {
    return true;
  }
};

export function isMoney(values, value) {
  if (typeof value == 'number')
    return true;

  if (value) {
    let isValid = /^(-){0,1}[0-9]+(\.[0-9]{2})?$/.test(value);
    return isValid ? true : "Invalid money amount";
  } else {
    return true;
  }
};

export function greaterOrEqual(value, minValue) {
  let parsedValue = parseFloat(value);
  return parsedValue < minValue ? `Value can not be less then ${minValue}` : true;
};

export function lessOrEqual(value, maxValue) {
  let parsedValue = parseFloat(value);
  return parsedValue > maxValue ? `Value can not be greater then ${maxValue}` : true;
};

export function futureDate(values, value, maxValue) {
  let date = moment(value, 'YYYY-MM-DD', true);
  if (date.isValid()) {
    let diff = date.diff(moment());
    return diff < 0 ? "The date must be in the future" : true;
  }
  return true;
};

export function isGuid(value) {
  if (value) {
    let isValid = /^(\{{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}\}{0,1})$/.test(value);
    return isValid ? true : "Invalid ID value"
  } else {
    return true;
  }
};

export default validations;
