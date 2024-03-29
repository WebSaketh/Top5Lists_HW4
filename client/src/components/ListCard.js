import { useContext, useState } from "react";
import { GlobalStoreContext } from "../store";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteModal from "./DeleteModal";

/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
  const { store } = useContext(GlobalStoreContext);
  const [editActive, setEditActive] = useState(false);
  const { idNamePair } = props;
  const [text, setText] = useState(idNamePair.name);

  function handleLoadList(event, id) {
    if (!event.target.disabled) {
      // CHANGE THE CURRENT LIST
      store.setCurrentList(id);
    }
  }

  function handleToggleEdit(event) {
    event.stopPropagation();
    toggleEdit(event);
  }
  function handleBlur() {
    toggleEdit();
    setText(idNamePair.name);
  }

  function toggleEdit() {
    let newActive = !editActive;
    if (newActive) {
      store.setIsListNameEditActive(true);
    }
    store.setIsListNameEditActive(false);
    setEditActive(newActive);
  }

  async function handleDeleteList(ev, id) {
    ev.preventDefault();
    ev.stopPropagation();
    await store.markListForDeletion(id);
  }

  async function confirmDelete(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    await store.deleteMarkedList();
    await store.loadIdNamePairs();
    await store.unmarkListForDeletion();
  }

  async function cancelDelete(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    await store.unmarkListForDeletion();
    console.log(store.listMarkedForDeletion);
  }

  function handleKeyPress(event) {
    if (event.code === "Enter") {
      let id = event.target.id.substring("list-".length);
      store.changeListName(id, text);
      toggleEdit();
    }
  }
  function handleUpdateText(event) {
    setText(event.target.value);
  }

  let cardElement = (
    <ListItem
      id={idNamePair._id}
      key={idNamePair._id}
      sx={{ marginTop: "15px", display: "flex", p: 1 }}
      button
      onClick={(event) => {
        handleLoadList(event, idNamePair._id);
      }}
      style={{
        fontSize: "48pt",
        width: "100%",
      }}
    >
      <DeleteModal
        message={idNamePair.name}
        presence={store.listMarkedForDeletion}
        handleClose={cancelDelete}
        confirmCallback={confirmDelete}
        subtype={"delete-modal"}
      />
      <Box sx={{ p: 1, flexGrow: 1 }}>{idNamePair.name}</Box>
      <Box sx={{ p: 1 }}>
        <IconButton onClick={handleToggleEdit} aria-label="edit">
          <EditIcon style={{ fontSize: "48pt" }} />
        </IconButton>
      </Box>
      <Box sx={{ p: 1 }}>
        <IconButton
          onClick={(event) => {
            handleDeleteList(event, idNamePair._id);
          }}
          aria-label="delete"
        >
          <DeleteIcon style={{ fontSize: "48pt" }} />
        </IconButton>
      </Box>
    </ListItem>
  );

  if (editActive) {
    cardElement = (
      <TextField
        margin="normal"
        required
        fullWidth
        id={"list-" + idNamePair._id}
        label="Top 5 List Name"
        name="name"
        autoComplete="Top 5 List Name"
        className="list-card"
        onKeyPress={handleKeyPress}
        onChange={handleUpdateText}
        onBlur={handleBlur}
        defaultValue={idNamePair.name}
        inputProps={{ style: { fontSize: 48 } }}
        InputLabelProps={{ style: { fontSize: 24 } }}
        autoFocus
      />
    );
  }
  return cardElement;
}

export default ListCard;
