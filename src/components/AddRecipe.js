import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db, storage } from "../firebaseConfig";
import { TextField, Button, Box, Stack } from "@mui/material";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const AddRecipe = () => {
  //states to store the values from the user
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  //handles adding a new recipe
  const handleAddRecipe = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = "";

      //if there's an image, we upload it to firebase storage
      if (image) {
        const imageRef = ref(storage, `recipes/${image.name}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }

      //add recipe to firestore with the image url
      await addDoc(collection(db, "recipes"), {
        name,
        description,
        imageUrl,
      });

      //clean everything
      setName("");
      setDescription("");
      setImage(null);
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
      <Stack spacing={2} sx={{ width: "100%" }}>
        {/* Input field fot the recipe name */}
        <TextField
          label="Recipe name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        {/* Input field fot the description */}
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={4}
          required
        />
        {/*Button for adding an image*/}
        <Button variant="contained" component="label">
          Upload Image
          <input
            type="file"
            hidden
            onChange={(e) => setImage(e.target.files[0])}
          />
        </Button>
        {/*Display the image*/}
        {image && <p>{image.name}</p>}
        {/*Button for adding the whole recipe*/}
        <Button type="submit" variant="contained" color="primary">
          Add Recipe
        </Button>
      </Stack>
    </Box>
  );
};

export default AddRecipe;
