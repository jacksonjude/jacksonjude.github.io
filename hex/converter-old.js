var hexCode = ""
var binCode = ""
var decimalCode = 0
var asciiCode = ""

var asciiToHex = {" ":"20","!":"21","\"":"22","#":"23","$":"24","%":"25","&":"26","\'":"27","(":"28",")":"29","*":"2A","+":"2B",",":"2C","-":"2D",".":"2E","/":"2F","0":"30","1":"31","2":"32","3":"33","4":"34","5":"35","6":"36","7":"37","8":"38","9":"39",":":"3A",";":"3B","<":"3C","=":"3D",">":"3E","?":"3F","@":"40","A":"41","B":"42","C":"43","D":"44","E":"45","F":"46","G":"47","H":"48","I":"49","J":"4A","K":"4B","L":"4C","M":"4D","N":"4E","O":"4F","P":"50","Q":"51","R":"52","S":"53","T":"54","U":"55","V":"56","W":"57","X":"58","Y":"59","Z":"5A","[":"5B","\\":"5C","]":"5D","^":"5E","_":"5F","`":"60","a":"61","b":"62","c":"63","d":"64","e":"65","f":"66","g":"67","h":"68","i":"69","j":"6A","k":"6B","l":"6C","m":"6D","n":"6E","o":"6F","p":"70","q":"71","r":"72","s":"73","t":"74","u":"75","v":"76","w":"77","x":"78","y":"79","z":"7A","{":"7B","}":"7C","|":"7D","~":"7E"}

var binCharacterArray = binCode.split("")
var binNibbleArray = []

var hexCharacterArray = hexCode.split("")
var decimalCharacterArray = []

var settingHex = false
var settingBin = false


//Binary to Hex
function clearBinArrays()
{
  binCode = ""
  binCharacterArray = binCode.split("")
  binNibbleArray = []
  hexCode = ""
  decimalCode = 0
}

function checkForValidBinary(binary)
{
  var splitBinary = binary.split("")

  var validSize = (splitBinary.length%4 == 0)

  var validCharacters = true
  for (i=0;i<splitBinary.length;i++)
  {
    if (splitBinary[i] != "0" && splitBinary[i] != "1")
    {
      validCharacters = false
    }
  }

  if (validSize && validCharacters)
  {
    return true
  }
  else
  {
    return false
  }
}

function updateBinArrays()
{
  binCharacterArray = binCode.split("")
  for (i=0;i<binCharacterArray.length;i+=4)
  {
    var nibble = binCharacterArray[i] + binCharacterArray[i+1] + binCharacterArray[i+2] + binCharacterArray[i+3]
    binNibbleArray.push(nibble)
  }
  console.log(binNibbleArray)
}

function calculateBinToHex()
{
  clearBinArrays()
  binCode = document.getElementById('binInput').value
  if (checkForValidBinary(binCode))
  {
    updateBinArrays()
    for (i=0;i<binNibbleArray.length;i++)
    {
      var nibbleTotal = 0
      for (j=0;j<4;j++)
      {
        k = 3 - j
        var bitMultiplier = Math.pow(2, k)
        var bit = parseInt(binNibbleArray[i].split("")[j])
        var bitToHex = bit*bitMultiplier
        nibbleTotal += (bitToHex)
      }
      var hexNibble = decimalToHex(nibbleTotal)
      hexCode = hexCode + hexNibble
    }
    console.log(hexCode)

    document.getElementById('hexInput').value = hexCode
    document.getElementById('decimalInput').value = decimalCode

    calculateHexToASCII()
    calculateHexToBin()
  }
  else
  {
    console.log("Invalid Binary!")
  }
}

function decimalToHex(nibbleTotal)
{
  if (nibbleTotal < 10)
  {
    return nibbleTotal
  }
  else
  {
    switch (nibbleTotal)
    {
      case 10:
        return "A"
        break
      case 11:
        return "B"
        break
      case 12:
        return "C"
        break
      case 13:
        return "D"
        break
      case 14:
        return "E"
        break
      case 15:
        return "F"
    }
  }
}

//Hex to binary
function clearHexArrays()
{
  binCode = ""
  hexCode = ""
  decimalCode = 0
  hexCharacterArray = hexCode.split("")
  decimalCharacterArray = []
}

function checkForValidHex(hex)
{
  var splitHex = hex.split("")

  var allowedCharacters = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"]
  var validCharacters = false
  var hasInvalidCharacter = false
  for (i=0;i<splitHex.length;i++)
  {
    var equalsValidCharacter = false
    for (j=0;j<allowedCharacters.length;j++)
    {
      if (splitHex[i].toUpperCase() == allowedCharacters[j])
      {
        equalsValidCharacter = true
      }
    }
    if (!equalsValidCharacter)
    {
      hasInvalidCharacter = true
    }
  }

  if (!hasInvalidCharacter)
  {
    validCharacters = true
  }

  if (validCharacters)
  {
    return true
  }
  else
  {
    return false
  }
}

function updateHexArrays()
{
  hexCharacterArray = hexCode.split("")
  console.log(hexCode)
}

function hexToDecimal(hexCharacter)
{
  if (parseInt(hexCharacter))
  {
    return hexCharacter
  }
  else if (hexCharacter == "0")
  {
    return 0
  }
  else
  {
    if (hexCharacter != null)
    {
      switch (hexCharacter.toUpperCase())
      {
        case "A":
          return "10"
          break
        case "B":
          return "11"
          break
        case "C":
          return "12"
          break
        case "D":
          return "13"
          break
        case "E":
          return "14"
          break
        case "F":
          return "15"
          break
      }
    }
  }
}

function calculateHexToBin()
{
  clearHexArrays()
  document.getElementById('hexInput').value = document.getElementById('hexInput').value.replace(/\s/g, "")
  hexCode = document.getElementById('hexInput').value
  if (checkForValidHex(hexCode))
  {
    updateHexArrays()
    for (i=0;i<hexCharacterArray.length;i++)
    {
      j = hexCharacterArray.length - i - 1
      decimalCharacterArray.push(hexToDecimal(hexCharacterArray[i]))
      decimalToAdd = parseInt(hexToDecimal(hexCharacterArray[i])) * Math.pow(16, j)
      decimalCode = decimalCode + decimalToAdd
    }
    console.log(decimalCode)

    for (j=0;j<decimalCharacterArray.length;j++)
    {
      currentValueLeft = parseInt(decimalCharacterArray[j])
      binNibble = ""
      for (k=0;k<4;k++)
      {
        binNibble = (currentValueLeft%2) + binNibble
        currentValueLeft = (currentValueLeft/2) - ((currentValueLeft%2)/2)
      }
      binCode = binCode + binNibble
    }
    console.log(binCode)
    document.getElementById('binInput').value = binCode
    if (hexCode != "")
    {
      document.getElementById('decimalInput').value = decimalCode
    }
    else
    {
      document.getElementById('decimalInput').value = ""
    }

    calculateHexToASCII()
  }
  else
  {
    console.log("Invalid Hex!")
  }
}

//ASCII To Hex

function calculateASCIIToHex(ascii)
{
  clearHexArrays()
  asciiCode = ascii
  for (i=0;i<asciiCode.split("").length;i++)
  {
    if (asciiToHex[asciiCode[i]] != null)
    {
      hexCode = hexCode + asciiToHex[asciiCode[i]]
    }
  }
  document.getElementById('hexInput').value = hexCode
  calculateHexToBin()
}

function calculateHexToASCII()
{
  hexCode = document.getElementById('hexInput').value.toUpperCase()
  if ((hexCode.length%2) == 0)
  {
    asciiCode = ""
    var hexToASCII = invertDictionary(asciiToHex)
    for (i=0;i<hexCode.split("").length;i+=2)
    {
      asciiCharacter = hexToASCII[hexCode[i] + hexCode[i+1]]
      if (asciiCharacter != null)
      {
        asciiCode = asciiCode + asciiCharacter
      }
    }
    document.getElementById('asciiInput').value = asciiCode
    console.log(asciiCode)
  }
}

function invertDictionary(obj)
{
  var new_obj = {};

  for (var prop in obj) {
    if(obj.hasOwnProperty(prop)) {
      new_obj[obj[prop]] = prop;
    }
  }

  return new_obj;
}

//Decimal To Hex

function calculateDecimalToHex()
{
  if (parseInt(document.getElementById('decimalInput').value) === parseInt(document.getElementById('decimalInput').value))
  {
    decimalCode = document.getElementById('decimalInput').value
    hexCode = ""
    console.log(decimalCode)

    cannotDivide = false
    currentValueLeft = decimalCode
    while (!cannotDivide)
    {
      hexNibble = currentValueLeft%16
      currentValueLeft = (currentValueLeft/16) - ((currentValueLeft%16)/16)
      hexCode = decimalToHex(hexNibble) + hexCode
      if (currentValueLeft <= 0)
      {
        cannotDivide = true
      }
    }
    document.getElementById('hexInput').value = hexCode
    calculateHexToBin()
  }
  else if (document.getElementById('decimalInput').value == "")
  {
    document.getElementById('hexInput').value = ""
    document.getElementById('binInput').value = ""
    document.getElementById('asciiInput').value = ""
  }
  else
  {
    console.log("Invalid Decimal!")
  }
}
