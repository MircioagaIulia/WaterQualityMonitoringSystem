export const keyToTimestamp = (key) => {
    if (!key || typeof key !== 'string') {
      return null;
    }
  
    const parts = key.split("_");
    if (parts.length !== 2) return null;
  
    const dateParts = parts[0].split("-");
    if (dateParts.length !== 3) return null;
  
    let timeParts = parts[1].split("-");
    if (timeParts.length === 3) {
      timeParts = timeParts.join(":");
    }
  
    const dateString = `${dateParts[0]}-${dateParts[1]}-${dateParts[2]}T${timeParts}`;
    const timestamp = new Date(dateString);
  
    if (isNaN(timestamp)) return null;
  
    return timestamp;
  };