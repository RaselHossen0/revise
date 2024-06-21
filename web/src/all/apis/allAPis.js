
import { useState } from 'react';
import { apiUrl,cateGory } from '../const.js';

const fetechCategory = async () => {
    try {
        const email = localStorage.getItem('email');
      const url = apiUrl+cateGory+'?usermail='+email;

      const response = await fetch(url);
      const data = await response.json();

      return data;
    } catch (error) {
      console.error('Error fetching category:', error);
    }
  };

  export default fetechCategory;