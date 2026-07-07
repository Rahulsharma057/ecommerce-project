"use client";

import { useEffect, useState } from "react";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Stack,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Divider,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import axios from "axios";
import { API_URL } from "@/lib/api";


export default function ContactAdminPage() {


  const [contacts,setContacts] = useState([]);

  const [selected,setSelected] = useState(null);

  const [open,setOpen] = useState(false);

  const [deleteOpen,setDeleteOpen] = useState(false);



  const getContacts = async()=>{

    try{

      const res = await axios.get(
        `${API_URL}/contact/admin`
      );

      setContacts(res.data.data || []);

    }
    catch(error){

      console.log(error);

    }

  };




  useEffect(()=>{

    getContacts();

  },[]);





  const handleDelete = async()=>{


    try{


      await axios.delete(
        `${API_URL}/contact/admin/${selected._id}`
      );


      setDeleteOpen(false);

      setSelected(null);

      getContacts();


    }
    catch(error){

      console.log(error);

    }


  };






return(

<Box
sx={{
p:{xs:2,md:4}
}}
>


<Typography

variant="h4"

fontWeight={800}

mb={1}

>

Customer Messages

</Typography>


<Typography

color="text.secondary"

mb={3}

>

Manage customer enquiries and support requests

</Typography>





<Card

sx={{

borderRadius:3,

boxShadow:"0 8px 30px rgba(0,0,0,0.08)"

}}

>


<TableContainer>


<Table>



<TableHead>


<TableRow

sx={{

bgcolor:"#111"

}}

>


{
[
"Name",
"Email",
"Phone",
"Message",
"Status",
"Action"

].map((head)=>(


<TableCell

key={head}

sx={{

color:"#fff",

fontWeight:700

}}

>

{head}

</TableCell>


))
}



</TableRow>


</TableHead>





<TableBody>


{

contacts.map((item)=>(


<TableRow

key={item._id}

hover

sx={{

"&:hover":{

bgcolor:"#fafafa"

}

}}

>


<TableCell>

<Typography fontWeight={600}>

{item.name}

</Typography>

</TableCell>



<TableCell>

{item.email}

</TableCell>



<TableCell>

{item.phone}

</TableCell>



<TableCell>

<Box

sx={{

maxWidth:250

}}

>

<Typography

noWrap

>

{item.message}

</Typography>


</Box>


</TableCell>



<TableCell>


<Chip

label={item.status}

size="small"

color={
item.status==="New"
?"warning"
:"success"
}

/>


</TableCell>




<TableCell>


<Stack direction="row">


<Tooltip title="View">

<IconButton

color="primary"

onClick={()=>{

setSelected(item);

setOpen(true);

}}

>

<VisibilityIcon/>

</IconButton>


</Tooltip>




<Tooltip title="Delete">


<IconButton

color="error"

onClick={()=>{

setSelected(item);

setDeleteOpen(true);

}}

>

<DeleteOutlineIcon/>

</IconButton>


</Tooltip>



</Stack>


</TableCell>




</TableRow>


))


}



</TableBody>



</Table>


</TableContainer>



</Card>









{/* VIEW DIALOG */}


<Dialog

open={open}

onClose={()=>setOpen(false)}

maxWidth="sm"

fullWidth

>


<DialogContent>


<Card

sx={{

borderRadius:4

}}

>


<CardContent>


<Typography

variant="h5"

fontWeight={800}

mb={2}

>

Customer Details

</Typography>



<Divider sx={{mb:3}}/>



<Stack spacing={2}>


<Typography>

<b>Name:</b> {selected?.name}

</Typography>



<Typography>

<b>Email:</b> {selected?.email}

</Typography>



<Typography>

<b>Phone:</b> {selected?.phone}

</Typography>



<Box>

<Typography fontWeight={700}>

Message

</Typography>


<Card

sx={{

mt:1,

bgcolor:"#f7f7f7"

}}

>

<CardContent>

<Typography>

{selected?.message}

</Typography>


</CardContent>

</Card>


</Box>



<Typography>

<b>Date:</b>{" "}

{

selected?.createdAt &&

new Date(
selected.createdAt
).toLocaleDateString()

}

</Typography>


</Stack>



<Button

fullWidth

sx={{mt:3}}

variant="contained"

onClick={()=>setOpen(false)}

>

Close

</Button>



</CardContent>


</Card>


</DialogContent>


</Dialog>










{/* DELETE CONFIRM */}


<Dialog

open={deleteOpen}

onClose={()=>setDeleteOpen(false)}

>


<DialogContent>


<Typography

variant="h6"

fontWeight={700}

>

Delete Message?

</Typography>


<Typography

mt={1}

color="text.secondary"

>

Are you sure you want to delete this customer message?

</Typography>


</DialogContent>



<DialogActions>


<Button

onClick={()=>setDeleteOpen(false)}

>

Cancel

</Button>


<Button

color="error"

variant="contained"

onClick={handleDelete}

>

Delete

</Button>


</DialogActions>



</Dialog>





</Box>

);


}