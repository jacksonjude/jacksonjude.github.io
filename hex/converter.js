const kHex = "hex"
const kOct = "oct"
const kBin = "bin"
const kDecSum = "decsum"
const kDecSpaced = "decspaced"
const kASCII = "ascii"

const baseCodes = {}
baseCodes[kHex] = 16
baseCodes[kOct] = 8
baseCodes[kBin] = 2
baseCodes[kDecSum] = 10

const specialBaseCodes = [kDecSpaced, kASCII]

const baseSpaces = {}
baseSpaces[kHex] = 2
baseSpaces[kOct] = 8
baseSpaces[kBin] = 8
baseSpaces[kDecSum] = 0
baseSpaces[kDecSpaced] = 3
baseSpaces[kASCII] = 1

const maxBaseBoxSizes = {} // Could update this later to account for screen size, currently is perfected for 1792x1120
maxBaseBoxSizes[kHex] = 83
maxBaseBoxSizes[kOct] = 83
maxBaseBoxSizes[kBin] = 251
maxBaseBoxSizes[kDecSum] = 134
maxBaseBoxSizes[kDecSpaced] = 218
maxBaseBoxSizes[kASCII] = 67

const disabledEditingBases = [kDecSpaced]

const decimalCharacters = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
const overflowCharacters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
const validCharacters = decimalCharacters.concat(overflowCharacters).concat()
const unknownCharacter = "\0"

const asciiToHex = {"\0":"00"," ":"20","!":"21","\"":"22","#":"23","$":"24","%":"25","&":"26","\'":"27","(":"28",")":"29","*":"2A","+":"2B",",":"2C","-":"2D",".":"2E","/":"2F","0":"30","1":"31","2":"32","3":"33","4":"34","5":"35","6":"36","7":"37","8":"38","9":"39",":":"3A",";":"3B","<":"3C","=":"3D",">":"3E","?":"3F","@":"40","A":"41","B":"42","C":"43","D":"44","E":"45","F":"46","G":"47","H":"48","I":"49","J":"4A","K":"4B","L":"4C","M":"4D","N":"4E","O":"4F","P":"50","Q":"51","R":"52","S":"53","T":"54","U":"55","V":"56","W":"57","X":"58","Y":"59","Z":"5A","[":"5B","\\":"5C","]":"5D","^":"5E","_":"5F","`":"60","a":"61","b":"62","c":"63","d":"64","e":"65","f":"66","g":"67","h":"68","i":"69","j":"6A","k":"6B","l":"6C","m":"6D","n":"6E","o":"6F","p":"70","q":"71","r":"72","s":"73","t":"74","u":"75","v":"76","w":"77","x":"78","y":"79","z":"7A","{":"7B","}":"7C","|":"7D","~":"7E"}

var baseValues = {}

const textAreaHeightLimit = 302

function convertFromBase(baseCode, rawBaseValue)
{
  var originalBaseValue = rawBaseValue
  if (baseCode != kASCII)
  {
    originalBaseValue = originalBaseValue.toUpperCase().replace(/\s+/g, "")
  }

  if (!checkForValidInput(baseCode, originalBaseValue) || disabledEditingBases.includes(baseCode))
  {
    setBaseTextBox(baseCode, baseValues[baseCode] || "")
    return
  }

  var decimalValue = convertToDecimal(baseCode, originalBaseValue)

  for (baseCodeNum in Object.keys(baseCodes))
  {
    var newBaseCode = Object.keys(baseCodes)[baseCodeNum]
    var splitNewBaseValue = convertFromDecimal(newBaseCode, decimalValue).split("")

    var spacedBaseValue = ""
    for (characterNum in splitNewBaseValue)
    {
      if (characterNum > 0 && characterNum % baseSpaces[newBaseCode] == 0)
      {
        spacedBaseValue += " "
      }
      spacedBaseValue += splitNewBaseValue[characterNum]
    }

    setBaseTextBox(newBaseCode, spacedBaseValue)
    baseValues[newBaseCode] = spacedBaseValue
  }

  var hexValue = baseValues[kHex].replace(/\s+/g, "").split("")
  for (baseCodeNum in specialBaseCodes)
  {
    switch (specialBaseCodes[baseCodeNum])
    {
      case kDecSpaced:
      var decSpacedString = ""

      var currentDecValue = 0
      for (hexCharacterNum in hexValue)
      {
        currentDecValue += getDecimalFromCharacter(hexValue[hexCharacterNum])*Math.pow(baseCodes[kHex], ((parseInt(hexCharacterNum)+1)%2))
        if ((parseInt(hexCharacterNum)+1) % 2 == 0 || hexCharacterNum == hexValue.length-1)
        {
          if (currentDecValue < 10)
          {
            decSpacedString += "00" + currentDecValue + " "
          }
          else if (currentDecValue < 100)
          {
            decSpacedString += "0" + currentDecValue + " "
          }
          else
          {
            decSpacedString += currentDecValue + " "
          }

          currentDecValue = 0
        }
      }

      setBaseTextBox(kDecSpaced, decSpacedString)
      baseValues[kDecSpaced] = decSpacedString
      break

      case kASCII:
      var asciiString = ""

      var currentHexCharacter = ""
      for (hexCharacterNum in hexValue)
      {
        currentHexCharacter += hexValue[hexCharacterNum]
        if ((parseInt(hexCharacterNum)+1) % 2 == 0)
        {
          asciiString += getASCIIValueFromHex(currentHexCharacter)

          currentHexCharacter = ""
        }
      }

      setBaseTextBox(kASCII, asciiString)
      baseValues[kASCII] = asciiString
      break
    }
  }
}

function checkForValidInput(baseCode, rawInput)
{
  if (baseCode == kASCII) { return true }

  var rawInputCharacters = rawInput.split("")
  for (characterNum in rawInputCharacters)
  {
    if (!validCharacters.includes(rawInputCharacters[characterNum]))
    {
      return false
    }
  }

  return true
}

function convertToDecimal(baseCode, baseValue)
{
  if (baseCode == kASCII) { return convertASCIIToDecimal(baseValue) }

  var valueCharacters = baseValue.split("")

  var decimalSum = bigInt(0)
  for (characterPosition in valueCharacters)
  {
    var decimalValue = getDecimalFromCharacter(valueCharacters[characterPosition])
    if (decimalValue == unknownCharacter) { return unknownCharacter }

    decimalSum = decimalSum.add(bigInt(decimalValue).multiply(bigInt(baseCodes[baseCode]).pow(valueCharacters.length-1-characterPosition)))
  }

  return decimalSum
}

function convertFromDecimal(baseCode, decimalValue)
{
  var convertedBaseString = ""
  while (decimalValue > 0)
  {
    var divModResult = decimalValue.divmod(baseCodes[baseCode])

    //console.log(baseCodes[baseCode], convertedBaseString, divModResult.remainder.toJSNumber(), decimalValue.toJSNumber())

    convertedBaseString = getCharacterFromDecimal(divModResult.remainder.toJSNumber()) + convertedBaseString
    decimalValue = divModResult.quotient
  }

  if (baseCode == kBin)
  {
    var zerosToPrepend = baseSpaces[kBin]-(convertedBaseString.length%baseSpaces[kBin])
    if (zerosToPrepend == baseSpaces[kBin])
    {
      zerosToPrepend = 0
    }
    for (i=0; i < zerosToPrepend; i++)
    {
      convertedBaseString = "0" + convertedBaseString
    }
  }

  return convertedBaseString
}

function getCharacterFromDecimal(decimalValue)
{
  if (decimalValue < validCharacters.length)
  {
    return validCharacters[decimalValue]
  }
  else
  {
    return unknownCharacter
  }
}

function getDecimalFromCharacter(character)
{
  if (validCharacters.includes(character))
  {
    return validCharacters.indexOf(character)
  }
  else
  {
    return unknownCharacter
  }
}

function convertASCIIToDecimal(asciiValue)
{
  var hexValue = ""

  var asciiCharacters = asciiValue.split("")
  for (characterNum in asciiCharacters)
  {
    hexValue += asciiToHex[asciiCharacters[characterNum]] || asciiToHex[unknownCharacter]
  }

  return convertToDecimal(kHex, hexValue)
}

function getASCIIValueFromHex(hexValue)
{
  return getKeyByValue(asciiToHex, hexValue) || unknownCharacter
}

function getHexValueFromASCII(asciiValue)
{
  return asciiToHex[hexValue]
}

function setBaseTextBox(baseCode, valueToSet)
{
  var textArea = document.getElementById(baseCode)
  textArea.value = valueToSet

  textArea.style.height = "" // Reset the height
  textArea.style.height = Math.min(textArea.scrollHeight-5, maxBaseBoxSizes[baseCode] || textAreaHeightLimit) + "px"
}

function getKeyByValue(object, value)
{
  return Object.keys(object).find(key => object[key] == value)
}
