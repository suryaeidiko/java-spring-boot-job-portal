import React, { useState, useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Card, Grid, InputAdornment, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Search = () => {
  const [query, setQuery] = useState('');
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  const handleEdit = (id) => {
    navigate('/edit', { state: { id } });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (query.length === 0) {
          const response = await axios.get('http://localhost:8002/jobPosts');
          setPosts(response.data);
        } else if (query.length > 2) {
          const response = await axios.get(`http://localhost:8002/jobPost/keyword/${query}`);
          setPosts(response.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [query]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8002/jobPost/${id}`);
      setPosts(posts.filter((post) => post.postId !== id));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <Grid container spacing={2} sx={{ margin: '2%' }}>
      {/* <Grid item xs={12} sx={12} md={12} lg={12}> */}
      <Grid item xs={12} md={12} lg={12}>
        <Box>
          <TextField
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            placeholder="Search..."
            sx={{ width: '75%', padding: '2% auto' }}
            fullWidth
            onChange={(e) => setQuery(e.target.value)}
          />
        </Box>
      </Grid>
      {posts.map((post) => (
        <Grid key={post.postId} item xs={12} md={6} lg={4}>
          <Card sx={{ padding: '3%', overflow: 'hidden', width: '84%', backgroundColor: '#ADD8E6' }}>
            <Typography variant="h5" sx={{ fontSize: '2rem', fontWeight: 600, fontFamily: 'sans-serif' }}>
              {post.username}
            </Typography>
            <Typography sx={{ color: '#585858', marginTop: '2%', fontFamily: 'cursive' }} variant="body">
              Description: {post.postDesc}
            </Typography>
            <br />
            <br />
            <Typography variant="h6" sx={{ fontFamily: 'unset', fontSize: '400' }}>
              Experience: {post.experience} years
            </Typography>
            <Typography sx={{ fontFamily: 'serif', fontSize: '400' }} gutterBottom variant="body">
              Skills :
            </Typography>
            {post.postTechStack.map((skill, index) => (
              <Typography variant="body" gutterBottom key={index}>
                {skill} .
              </Typography>
            ))}
            <DeleteIcon onClick={() => handleDelete(post.postId)} />
            <EditIcon onClick={() => handleEdit(post.postId)} />
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default Search;
