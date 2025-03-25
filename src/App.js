// App.js
import React from "react";
import RecipesList from "./components/RecipesList";
import AddRecipe from "./components/AddRecipe";
import { Container, Typography } from "@mui/material";

function App() {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        RecipePal
      </Typography>
      <AddRecipe />
    </Container>
  );
}

export default App;
