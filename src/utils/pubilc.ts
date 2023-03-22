//eg：hello_world => helloWorld
function underline2Hump(s: any) {
  return s.replace(/_(\w)/g, function (all: any, letter: string) {
    return letter.toUpperCase()
  })
}

//eg：helloWorld => hello_world
export function hump2Underline(s: string) {
  return s.replace(/([A-Z])/g, '_$1').toLowerCase()
}

export function jsonToHump(obj: any) {
  if (obj instanceof Array) {
    obj.forEach(function (v, i) {
      jsonToHump(v)
    })
  } else if (obj instanceof Object) {
    Object.keys(obj).forEach(function (key) {
      var newKey = underline2Hump(key)
      if (newKey !== key) {
        obj[newKey] = obj[key]
        delete obj[key]
      }
      jsonToHump(obj[newKey])
    })
  }
}

export function jsonToUnderline(obj: any) {
  if (obj instanceof Array) {
    obj.forEach(function (v, i) {
      jsonToUnderline(v)
    })
  } else if (obj instanceof Object) {
    Object.keys(obj).forEach(function (key) {
      var newKey = hump2Underline(key)
      if (newKey !== key) {
        obj[newKey] = obj[key]
        delete obj[key]
      }
      jsonToUnderline(obj[newKey])
    })
  }
}
