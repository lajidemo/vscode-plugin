import * as handlebars from 'handlebars'
import * as _ from 'lodash'

let handlebarsInitialized = false;

export function initializeHandlebars() {
  handlebars.registerHelper({
    camelCase: (input) => {
      return _.camelCase(input);
    },
    kebabCase: (input) => {
      return _.kebabCase(input);
    },
    lowerCase: (input) => {
      return _.lowerCase(input);
    },
    lowerDotCase: (input) => {
      return _.snakeCase(input).replace(/_/g, ".");
    },
    pascalCase: (input) => {
      return _.chain(input).camelCase().upperFirst().value();
    },
    snakeCase: (input) => {
      return _.snakeCase(input);
    },
    upperCase: (input) => {
      return _.upperCase(input);
    },
    upperSnakeCase: (input) => {
      return _.snakeCase(input).toUpperCase();
    },
  });
}
export const transformTpl = (tplCon: string,name: string) =>{
  if(!handlebarsInitialized){
    initializeHandlebars()
    handlebarsInitialized = true;
  }
  const template = handlebars.compile(tplCon)
  const content = template({name})
  return content
}

function replaceName(str:string, exp: string, replaceText: string) {
  return str.replace(new RegExp(exp, 'g'), replaceText)
}

export const transformTplFileName = (TplFileName: string,inputName: string) => {
  let result = replaceName(TplFileName,'__name__',inputName)
  result = replaceName(result, "__kebabCase_name__", _.kebabCase(inputName));
  result = replaceName(result, "__pascalCase_name__", _.chain(inputName).camelCase().upperFirst().value());
  result = replaceName(result, "__snakeCase_name__", _.snakeCase(inputName));
  result = replaceName(result, "__lowerDotCase_name__", _.snakeCase(inputName).replace(/_/g, "."));
  result = replaceName(result, "__camelCase_name__", _.camelCase(inputName));
  result = replaceName(result, "__upperCase_name__", _.upperCase(inputName));
  result = replaceName(result, "__lowerCase_name__", _.lowerCase(inputName));
  result = replaceName(result, "__upperSnakeCase_name__", _.snakeCase(inputName).toUpperCase());
  console.log('result===',result)
  return result
}