import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { TextField, Button, Box } from "@mui/material";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const AddRecipe = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const handleAddRecipe = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "description"), { name, description });
      setName("");
      setPrice("");
    } catch (err) {
      console.error("Error adding recipe: ", err);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleAddRecipe}
      sx={{ display: "flex", gap: 2, mb: 2 }}
    >
      <TextField
        label="Recipe name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <Button type="submit" variant="contained" color="primary">
        Add Recipe
      </Button>
    </Box>
  );
};

export default AddRecipe;
