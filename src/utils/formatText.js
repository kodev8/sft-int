const formatText = (text, tolower=false) => {
    let formatted = text.trim()
    if (tolower) {
        formatted = formatted.toLowerCase()
    }
    return formatted
}


module.exports = formatText;