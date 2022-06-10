import './App.css';
import axios from 'axios';
import apiUrlMapping from '../src/Resources/apiMapping.json';
import React from 'react';
import { GridToolbar } from '@mui/x-data-grid-pro';
import { useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import { TextField } from '@mui/material';
import { Dialog, DialogContent, DialogActions, DialogTitle} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { GridActionsCellItem } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';

const getRowsWithId = (rows) => {
  let id = 0
  let completeRowListArray = []
  for (let row of rows) {
    const rowsWithId = {
      id: id,
      ...row
    }
    id++
    completeRowListArray.push(rowsWithId)
  }
  return completeRowListArray
}

export default function App() {

  const columns = [
    {
      field: 'actions',
      type: 'actions',
      width: 100,
      getActions: (event) => [
        <GridActionsCellItem  onClick={(e) => onClickOfEditButton(event)} icon={<EditIcon/>} label="Edit" />,
        <GridActionsCellItem  onClick={(e) => deleteRecord(event.id)} icon={<DeleteIcon/>} label="Delete" />,
        <GridActionsCellItem  onClick={(e) => onClickOfViewButton(event)} icon={<VisibilityIcon/>} label="View" />
      ]
    },
    {
      field: 'city',
      headerName: 'City Name',
      width: 160
    },
    {
      field: 'countryid',
      headerName: 'Country Id',
      width: 150
    },
    {
      field: 'postalcode',
      headerName: 'Postal Code',
      width: 150
    },
    {
      field: 'locationid',
      headerName: 'Location Id',
      width: 175
    }
  ]

  const [rows, setRows] = React.useState([])
  const [addOrEdit, setAddOrEdit] = React.useState("")
  const [editId, setEditId] = React.useState("")
  const handleClickOpen = () => {setOpen(true);};
  const handleClickOpen2 = () => {setOpenView(true);};
  const [open, setOpen] = React.useState(false);
  const [openview, setOpenView] = React.useState(false);
  const [city, setCity] = React.useState("");
  const [countryId, setCountryId] = React.useState("");
  const [postalCode, setPostalCode] = React.useState("");
  const [locationId, setLocationId] = React.useState("");
  const handleClose = () => {setOpen(false);};
  const handleClose2 = () => {setOpenView(false);};



  const getAllRecords=()=>
  {
    axios.get(apiUrlMapping.locationsData.getAll).then(response =>
	{
    setRows(getRowsWithId(response.data))
    });
  }

  const onClickofSaveRecord = () => 
  {
    setAddOrEdit("Save")
    setCity("")
    setCountryId("")
    setPostalCode("")
    setLocationId("")
    handleClickOpen()
  }

  useEffect(() => {getAllRecords()}, []);

  const addOrEditRecordAndClose = (type) => 
  {
    if (type === "Edit") {editRecordAndClose()}
    if (type === "Save") {addRecordAndClose() }
  }

  const addRecordAndClose = () => 
  {
    if (city !== undefined && countryId !== undefined && postalCode !== undefined && locationId !== undefined)
	{
      let payload = 
	  {
        "city": city,
        "countryid": countryId,
        "postalcode": postalCode,
        "locationid": locationId
    }
      console.log("The Data to DB is " , payload)
      console.log(apiUrlMapping.locationsData.post)
      axios.post(apiUrlMapping.locationsData.post, payload).then(response => 
	  {
	      getAllRecords()
        handleClose()
        setCity("")
        setCountryId("")
        setPostalCode("")
        setLocationId("")
      })
      console.log(apiUrlMapping.locationsData.post)

    }
  }
  
  const deleteRecord = (index) =>
  {
    let dataId = rows[index]._id
    axios.delete(apiUrlMapping.locationsData.delete + "/" + dataId).then(()=>{getAllRecords();});
  }

  const onClickOfViewButton = (e) =>
  {
    let viewRecord = rows[e.id]
    setCity(viewRecord.city)
    setCountryId(viewRecord.countryid)
    setPostalCode(viewRecord.postalcode)
    setLocationId(viewRecord.locationid)
    handleClickOpen2()
  }

  const onClickOfEditButton = (e) => 
  {
    setAddOrEdit("Edit")
    let editRecord = rows[e.id]
    setCity(editRecord.city)
    setCountryId(editRecord.countryid)
    setPostalCode(editRecord.postalcode)
    setLocationId(editRecord.locationid)
    setEditId(editRecord._id)
    handleClickOpen()
  }

  const editRecordAndClose = () => 
  {
    if (city !== undefined && countryId !== undefined && postalCode !== undefined && locationId !== undefined){
      let payload = 
	  {
        "city": city,
        "countryid": countryId,
        "postalcode": postalCode,
        "locationid": locationId
    }
      axios.put(apiUrlMapping.locationsData.put + "/" + editId, payload).then(response => 
	  {
	      getAllRecords();
        handleClose();
      })
    }
  }

  return (
    <div className="table">
      <div className="tableheading">
        <h1>Locations</h1>
      </div>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          components={{Toolbar: GridToolbar,}}
          componentsProps={{toolbar: { showQuickFilter: true }}}
          columns={columns}
          pageSize={3}
          rowsPerPageOptions={[5]}
          checkboxSelection
          disableSelectionOnClick
        />
      </div>

      <div className="center" >
        <Button variant="contained" onClick={onClickofSaveRecord} >Add Record</Button>
      </div>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Location Data</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" id="city" onChange={(e) => { setCity(e.target.value) }} value={city} label="City Name" type="text" fullWidth />
          <TextField autoFocus margin="dense" id="countryid" onChange={(e) => { setCountryId(e.target.value) }} value={countryId} label="Country Id" type="text" fullWidth />
          <TextField autoFocus margin="dense" id="postalcode" onChange={(e) => { setPostalCode(e.target.value) }} value={postalCode} label="Postal Code" type="text" fullWidth />
          <TextField autoFocus margin="dense" id="locationid" onChange={(e) => { setLocationId(e.target.value) }} value={locationId} label="Location Id" type="text" fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => { addOrEditRecordAndClose(addOrEdit) }}>Save</Button>
        </DialogActions>
      </Dialog>


      <Dialog open={openview} onClose={handleClose2}>
        <DialogTitle>View Location Data</DialogTitle>
        <DialogContent>
          <TextField disabled={true} autoFocus margin="dense" id="city" onChange={(e) => { setCity(e.target.value) }} value={city} label="City Name" type="text" fullWidth />
          <TextField inputProps={{ readOnly: true, }} autoFocus margin="dense" id="countryid" onChange={(e) => { setCountryId(e.target.value) }} value={countryId} label="Country Id" type="text" fullWidth />
          <TextField inputProps={{ readOnly: true, }} autoFocus margin="dense" id="postalcode" onChange={(e) => { setPostalCode(e.target.value) }} value={postalCode} label="Postal Code" type="text" fullWidth />
          <TextField inputProps={{ readOnly: true, }} autoFocus margin="dense" id="locationid" onChange={(e) => { setLocationId(e.target.value) }} value={locationId} label="Location Id" type="text" fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose2}>Cancel</Button>
        </DialogActions>
      </Dialog>


    </div>
  );
}