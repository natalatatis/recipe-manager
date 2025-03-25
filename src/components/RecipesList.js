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

const RecipesList = () => {
  const [recipes, setRecipes] = useState([]);
  const [editingRecipeId, setEditingRecipeId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const colRef = collection(db, "recipes");
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const recipesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(recipesData);
    });

    return () => unsubscribe();
  }, []);

  const handleEdit = (recipe) => {
    setEditingRecipeId(recipe.id);
    setEditName(recipe.name);
    setEditDescription(recipe.description);
    setImageUrl(recipe.imageUrl || "");
  };

  const handleSave = async (recipeId) => {
    try {
      let updatedData = { name: editName, description: editDescription };

      //Upload new image to Firebase storage
      if (image) {
        const imageRed = ref(storage, `recipes/${image.name}`);
        await uploadBytes(imageRef, image);
        const url = await getDownloadURL(imageRef);
        updatedData = { ...updatedData, imageUrl: url };
      }

      const recipeRef = doc(db, "products", recipeId);
      await updateDoc(recipeRef, updatedData);
      setEditingRecipeId(null);
      setImage(null);
      setImageUrl("");
    } catch (err) {
      console.error("Error updating recipe:", err);
    }
  };

  const handleCancel = () => {
    setEditingRecipeId(null);
    setImage(null);
    setImageUrl("");
  };

  const handleDelete = async (recipeId) => {
    try {
      await deleteDoc(doc(db, "recipes", recipeId));
    } catch (err) {
      console.error("Error deleting recipe:", err);
    }
  };

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
          {editingRecipeIdId === recipe.id ? (
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
                fullWid
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
            <>
              <ListItemText
                primary={recipe.name}
                secondary={`Description: ${recipe.price}`}
              />
              {recipe.imageUrl && (
                <img
                  src={recipe.imageUrl}
                  alt="Recipe"
                  style={{ width: 50, height: 50 }}
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
