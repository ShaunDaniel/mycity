import { Box, Heading, Select,Button } from '@chakra-ui/react';
import { useContext } from 'react';


function CityFilters({ FilterContext }) {
  const { filters, setFilters } = useContext(FilterContext);

  const issues = [
    "Road-Related Issues",
    "Water-Related Issues",
    "Waste Management Issues",
    "Electricity-Related Issues",
    "Public Infrastructure Issues",
    "Environmental Issues",
    "Public Health and Safety Issues",
    "Public Transportation Issues",
    "Education and Social Infrastructure Issues",
    "Emergency and Disaster-Related Issues"
  ];

  const handleFilterChange = (event) => {
    const filterName = event.target.dataset.filter;
  
    setFilters({
      ...filters,
      [filterName]: event.target.value,
    });
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
        <Select placeholder="Select date" data-filter="date" onChange={handleFilterChange}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </Select>
      </Box>

      <Box mb={3}>
        <Heading as="h4" size="sm" mb={1}>
          Category
        </Heading>
        <Select placeholder="Select category" data-filter="category" onChange={handleFilterChange}>
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
        <Select placeholder="Select upvotes" data-filter="upvotes" onChange={handleFilterChange}>
          <option value="most">Most</option>
          <option value="least">Least</option>
        </Select>
      </Box>

      <Box mb={3}>
        <Heading as="h4" size="sm" mb={1}>
          Resolved
        </Heading>
        <Select placeholder="Select resolved status" data-filter="resolved" onChange={handleFilterChange}>
          <option value="resolved">Resolved</option>
          <option value="unresolved">Unresolved</option>
        </Select>
      </Box>
      

    </Box>
  );
}

export default CityFilters;