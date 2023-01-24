import Alert from '@mui/material/Alert';

export default function AlertModal(props){
    switch(props.alert){
        case 1:
            return <Alert severity="success">{props.msg}</Alert>
        case 2:
            return <Alert severity="info">{props.msg}</Alert>
        case 3:                
            return <Alert severity="warning">{props.msg}</Alert>
        case 4:                
            return <Alert severity="error">{props.msg}</Alert>
        default:
            return <></>  
    }
}