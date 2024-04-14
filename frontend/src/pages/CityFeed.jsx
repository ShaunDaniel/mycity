import { Box } from '@chakra-ui/react';

import City from '../components/City';
import CityFilters from '../components/CityFilters';
import FilterContext from '../components/FilterContext';
import { useState } from 'react';
import { useContext } from 'react';

import UserContext from '../components/UserContext';

function CityFeed() {

  const { user, setUser } = useContext(UserContext)

  const [filters, setFilters] = useState({});
  console.log()

  return (
    <FilterContext.Provider value={{ filters, setFilters }}>
      <Box display="flex" w="100%">
        <Box w="20%">
          <CityFilters FilterContext={FilterContext}/>
        </Box>
        <Box w="80%">
          <City user={user}/>
        </Box>
      </Box>
    </FilterContext.Provider>
  );
}

export default CityFeed;