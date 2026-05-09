import { z } from "zod";
import examConfigs from "../../examConfig";

const defaultPrimaryInputConfig = {
  label: "Enter Rank",
  placeholder: "Enter your rank",
  step: "1",
  min: "0",
  allowDecimal: false,
};

const nonEmptyString = z
  .union([z.string(), z.number()])
  .transform((value) => String(value).trim())
  .pipe(z.string().min(1));

export const getPrimaryInputConfig = (exam) =>
  examConfigs[exam]?.primaryInput || defaultPrimaryInputConfig;

const isRankInput = (inputConfig) =>
  String(inputConfig?.label || "")
    .toLowerCase()
    .includes("rank");

export const normalizePrimaryInputValue = (exam, value) => {
  if (value === "") return "";

  const inputConfig = getPrimaryInputConfig(exam);
  if (inputConfig.allowDecimal) {
    return value;
  }

  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) return "";
  return String(Math.floor(numericValue));
};

export const getPrimaryInputError = (exam, value) => {
  if (value === "") return "";

  const inputConfig = getPrimaryInputConfig(exam);
  const numericValue = Number(value);
  const rankInput = isRankInput(inputConfig);
  const minValue = rankInput ? 1 : Number(inputConfig.min ?? 0);
  const hasMax = inputConfig.max !== undefined;
  const maxValue = hasMax ? Number(inputConfig.max) : undefined;
  const rangeMessage = hasMax
    ? `Please enter a value between ${minValue} and ${maxValue}.`
    : `Please enter a value greater than or equal to ${minValue}.`;

  const parsedNumber = z.number().safeParse(numericValue);
  if (!parsedNumber.success || Number.isNaN(numericValue)) {
    return "Please enter a valid value.";
  }

  if (!inputConfig.allowDecimal && !Number.isInteger(numericValue)) {
    return "Please enter a whole number.";
  }

  if (numericValue < minValue) {
    return rankInput
      ? "Rank must be greater than or equal to 1."
      : rangeMessage;
  }

  if (hasMax && numericValue > maxValue) {
    return rangeMessage;
  }

  return "";
};

const getTneaScoreError = (value) => {
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) {
    return "Please enter a valid TNEA composite score.";
  }
  if (numericValue < 0 || numericValue > 200) {
    return "Please enter a TNEA composite score between 0 and 200.";
  }
  return "";
};

const getFieldLabel = (config, fieldName) => {
  const field = config?.fields?.find((item) => item.name === fieldName);
  if (!field) return fieldName;
  if (typeof field.label === "function") return fieldName;
  return field.label;
};

export const getExamQueryValidation = (query) => {
  const examResult = nonEmptyString.safeParse(query.exam);
  if (!examResult.success) {
    return {
      success: false,
      error: "Missing required parameter: exam",
    };
  }

  const exam = examResult.data;
  const config = examConfigs[exam];
  if (!config) {
    return {
      success: false,
      error: `Unsupported exam: ${exam}`,
    };
  }

  for (const field of config.fields) {
    const fieldResult = nonEmptyString.safeParse(query[field.name]);
    if (!fieldResult.success) {
      return {
        success: false,
        error: `Missing required parameter: ${getFieldLabel(
          config,
          field.name
        )}`,
      };
    }
  }

  const primaryInputConfig = config.primaryInput;
  const queryValue =
    exam === "JoSAA" ? query.mainRank || query.rank : query.rank;
  const requiresPrimaryInput = Boolean(primaryInputConfig) || exam === "TNEA";

  if (requiresPrimaryInput) {
    const inputName =
      exam === "JoSAA"
        ? "JEE Main rank"
        : primaryInputConfig?.label || "rank";
    const inputResult = nonEmptyString.safeParse(queryValue);

    if (!inputResult.success) {
      return {
        success: false,
        error: `Missing required parameter: ${inputName}`,
      };
    }

    const inputError =
      exam === "TNEA"
        ? getTneaScoreError(inputResult.data)
        : getPrimaryInputError(exam, inputResult.data);

    if (inputError) {
      return {
        success: false,
        error: inputError,
      };
    }
  }

  if (
    exam === "JoSAA" &&
    query.qualifiedJeeAdv === "Yes" &&
    !nonEmptyString.safeParse(query.advRank).success
  ) {
    return {
      success: false,
      error: "Missing required parameter: JEE Advanced rank",
    };
  }

  return {
    success: true,
    data: {
      exam,
      config,
    },
  };
};
