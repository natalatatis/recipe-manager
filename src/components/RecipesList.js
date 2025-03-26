import React, { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
  Button,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import { storage } from "../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const RecipesList = () => {
  // State variables for managing recipes and editing states
  const [recipes, setRecipes] = useState([]);
  const [editingRecipeId, setEditingRecipeId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  // Fetch recipes from firestore and listen for real-time updates
  useEffect(() => {
    const colRef = collection(db, "recipes");
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const recipesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecipes(recipesData);
    });

    return () => unsubscribe(); // Cleanup function to unsubscribe from Firestore updates
  }, []);

  // Enable editing mode and set current recipe data
  const handleEdit = (recipe) => {
    setEditingRecipeId(recipe.id);
    setEditName(recipe.name);
    setEditDescription(recipe.description);
    setImageUrl(recipe.imageUrl || "");
  };

  // Save edited recipe to Firestore
  const handleSave = async (recipeId) => {
    try {
      let updatedData = { name: editName, description: editDescription };

      // If a new image file is selected, we upload the new image
      if (image) {
        const imageRef = ref(storage, `recipes/${image.name}`);
        await uploadBytes(imageRef, image);
        const url = await getDownloadURL(imageRef);
        updatedData = { ...updatedData, imageUrl: url };
      }

      // Update Firestore document
      const recipeRef = doc(db, "recipes", recipeId);
      await updateDoc(recipeRef, updatedData);
      setEditingRecipeId(null);
      setImage(null);
      setImageUrl("");
    } catch (err) {
      console.error("Error updating recipe:", err);
    }
  };

  // Cancel editing mode
  const handleCancel = () => {
    setEditingRecipeId(null);
    setImage(null);
    setImageUrl("");
  };

  // Delete a recipe from Firestore
  const handleDelete = async (recipeId) => {
    try {
      await deleteDoc(doc(db, "recipes", recipeId));
    } catch (err) {
      console.error("Error deleting recipe:", err);
    }
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  return (
    <List>
      {recipes.map((recipe) => (
        <ListItem key={recipe.id}>
          {editingRecipeId === recipe.id ? (
            // Editing mode
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                gap: 1,
              }}
            >
              <TextField
                label="Recipe Name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                fullWidth
              />
              <TextField
                label="Description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                fullWidth
              />
              <Button variant="contained" component="label">
                Upload Image
                <input type="file" hidden onChange={handleImageChange} />
              </Button>
              {image && <p>{image.name}</p>}
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Recipe"
                  style={{ width: 100, height: 100 }}
                />
              )}

              <IconButton onClick={() => handleSave(recipe.id)}>
                <SaveIcon />
              </IconButton>
              <IconButton onClick={handleCancel}>
                <CancelIcon />
              </IconButton>
            </Box>
          ) : (
            // Display mode
            <>
              <ListItemText
                primary={recipe.title}
                secondary={`Description: ${recipe.description}`}
              />
              {recipe.imageUrl && (
                <img
                  src={recipe.imageUrl}
                  alt="Recipe"
                  style={{ width: 50, height: 50, objectFit: "cover" }}
                />
              )}

              <IconButton onClick={() => handleEdit(recipe)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDelete(recipe.id)}>
                <DeleteIcon />
              </IconButton>
            </>
          )}
        </ListItem>
      ))}
    </List>
  );
};

export default RecipesList;
