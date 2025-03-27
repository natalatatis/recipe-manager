// App.js
import React from "react";
import RecipesList from "./components/RecipesList";
import AddRecipe from "./components/AddRecipe";
import { Container, Typography, Box } from "@mui/material";
import { SiCodechef } from "react-icons/si";

function App() {
  return (
    <Container>
      <Box display="flex" alignItems="center" gap={1}>
        <Typography variant="h4" gutterBottom>
          RecipePal
        </Typography>
        <SiCodechef size={40} />
      </Box>
      <AddRecipe />
      <RecipesList />
    </Container>
  );
}

export default App;
