const validateEmail =(email)=>{
    const regex= /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

const initials = (name = '') => {
    // Ensure name is a string, then trim it
    const nameParts = name.trim().split(' ');
  
    // If there's only one word, return the first letter
    if (nameParts.length === 1) {
      return nameParts[0] ? nameParts[0][0].toUpperCase() : '';
    }
  
    // Otherwise, return the initials of all words
    return nameParts.map(part => part[0].toUpperCase()).join('');
  }

export {validateEmail, initials};

