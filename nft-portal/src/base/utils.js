export function replaceMethod(replacer) {
  return (target, propertyKey, descriptor) => {
    descriptor.value = replacer(descriptor.value)
    return descriptor
  }
}

export function isCancelled(exception) {
  return !!(exception && exception['__cancelled__'])
}

export function getMessageOfException(exception, apiErrorCodeMessageMap) {
  if (isCancelled(exception)) {
    return ''
  }

  if (exception instanceof Error) {
    return exception.message
  }
  if (typeof exception === 'string') {
    return exception
  }
  return getMessageOfApiException(exception, apiErrorCodeMessageMap)
}

export function getMessageOfApiException(exception, apiErrorCodeMessageMap) {
  return getMessageOfCode(exception.code, apiErrorCodeMessageMap)
}

export function getMessageOfCode(
  code,
  apiErrorCodeMessageMap
) {
  const codeAsKey = code + ''
  if (apiErrorCodeMessageMap.hasOwnProperty(codeAsKey)) {
    return `[${code}] ${apiErrorCodeMessageMap[codeAsKey]}`
  }

  return `[${code}] unknown error`
}


export function formatUrl(data) {
  return data && Object.keys(data).filter(key => data[key]).map(key => `${key}=${encodeURIComponent(data[key])}`).join('&') || ''
}
