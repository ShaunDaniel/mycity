import { Box, Heading, Select,Button } from '@chakra-ui/react';
import { useContext } from 'react';


function CityFilters({ filters,setFilters }) {

  const issues = [
    "Road-Related",
    "Water-Related",
    "Waste Management",
    "Electricity-Related",
    "Public Infrastructure",
    "Environmental",
    "Public Health and Safety",
    "Public Transportation",
    "Education and Social Infrastructure",
    "Emergency and Disaster-Related"
  ];

  const handleFilterChange = (event) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.value,
    });
    console.log("Filtering by", event.target.name, event.target.value )

  };

  return (
    <Box p={5}>
      <Heading as="h3" size="md" mb={3}>
        Filters
      </Heading>

      <Box mb={3}>
        <Heading as="h4" size="sm" mb={1}>
          Date
        </Heading>
        <Select placeholder="Select date" name="date" onChange={handleFilterChange}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </Select>
      </Box>

      <Box mb={3}>
        <Heading as="h4" size="sm" mb={1}>
          Category
        </Heading>
        <Select placeholder="Select category" name="category" onChange={handleFilterChange}>
          {issues.map((issue, index) => (
            <option key={index} value={issue}>
              {issue}
            </option>
          ))}
        </Select>
      </Box>

      <Box mb={3}>
        <Heading as="h4" size="sm" mb={1}>
          Upvotes
        </Heading>
        <Select placeholder="Select upvotes" name="upvotes" onChange={handleFilterChange}>
          <option value="most">Most</option>
          <option value="least">Least</option>
        </Select>
      </Box>

      <Box mb={3}>
        <Heading as="h4" size="sm" mb={1}>
          Resolved
        </Heading>
        <Select placeholder="Select resolved status" name="resolved" onChange={handleFilterChange}>
          <option value="resolved">Resolved</option>
          <option value="unresolved">Unresolved</option>
        </Select>
      </Box>
      

    </Box>
  );
}

export default CityFilters;