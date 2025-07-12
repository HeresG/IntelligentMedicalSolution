export const convertToLabelAndValue = (object, propertyKeyAsValue) => {
    return ({
        value: object[propertyKeyAsValue],
        label: String(object[propertyKeyAsValue])
    })
}

export const convertManyToLabelAndValue = (values, propertyKeyAsValue) => {
    return values.map(obj => convertToLabelAndValue(obj, propertyKeyAsValue))
}

const defaultDateTimeOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };

export const convertDateToLocalDate = (utcDate, options = defaultDateTimeOptions) => {
    const date = new Date(utcDate);
    return date.toLocaleString('en-GB', options).replace(',', '');
};
