<?php

$miclase = new class_db();


$method = $_SERVER['REQUEST_METHOD'];
$request = explode("/", substr(@$_SERVER['PATH_INFO'], 1));

switch ($method) {
  case 'PUT': 
    break;
  case 'POST':
    $id_usr = $_POST['id'];
    $nombre_usr = $_POST['nombre'];
    $dni_usr = $_POST['dni'];
    $loc_usr = $_POST['localidad_sel'];
    $editar = $_POST['editar'];
    echo $miclase->__editarUsuario($id_usr,$nombre_usr, $dni_usr, $loc_usr, $editar);
    break;
  case 'GET':
    if ($_GET){ 
        if (array_key_exists('clientes', $_GET)){
            echo $miclase->__selectClientes();
            return;
        }

        if (array_key_exists('usuario', $_GET)){
            $usuario = $_GET['usuario'];
            echo $miclase->__obtenerUsuario($usuario);
            return;
        } 

        if (array_key_exists('provincias', $_GET)){
            echo $miclase->__getAllProvincias();
            return;
        }

        if (array_key_exists('provincia', $_GET)){
                    $provincia_consulta = $_GET['provincia'];
                    echo $miclase->__selectLocalidades($provincia_consulta);
                    return;
        }
    }
    else{    
        echo $miclase->__selectProvincias();
        return;
    }

    break;
  default:  
    break;
}

class class_db {
    PUBLIC  $conn=NULL;
    PUBLIC $prov=NULL;

    CONST user      =   'test',
          pass      =   'test5678',
          db        =   'test_anatod',
          serverip  =   'anatod-test.c75o4mima6rb.us-east-1.rds.amazonaws.com';

    public function __construct(){
        if(!$this->conn){
            try {
                $this->conn = new mysqli(SELF::serverip,SELF::user,SELF::pass,SELF::db);
                $this->conn->set_charset("utf8");
                if (!$this->conn) {die('No se pudo conectar.');}
            } catch (Exception $exc) {
                echo $exc->getTraceAsString();
            }
        }
    }

    public function __getAllProvincias(){
        $sql = 'SELECT provincia_id, provincia_nombre, localidad_nombre, COUNT(*) as cant_clientes FROM provincias NATURAL JOIN clientes NATURAL JOIN localidades WHERE localidad_provincia = provincia_id and cliente_localidad = localidad_id GROUP BY provincia_id, provincia_nombre, localidad_nombre;';
        $resultado = $this->conn->query($sql);
        while($table = $resultado->fetch_assoc()){
            $provincia_id = $table['provincia_id'];
            $provincia_nombre = $table['provincia_nombre'];
            $localidad_nombre = $table['localidad_nombre'];
            $cant_clientes = $table['cant_clientes'];

            $datos_totales = (object)null;
            $datos_totales->prov_nombre = $provincia_nombre;
            $datos_totales->prov_id = $provincia_id;
            $datos_totales->localidad_nombre = $localidad_nombre;
            $datos_totales->cantidad_clientes = $cant_clientes;

            $array[] = $datos_totales;
        }

        return json_encode($array);
    }

    public function __selectProvincias(){
        $sql = "SELECT * FROM provincias;";
        $resultado = $this->conn->query($sql);
        while($table = $resultado->fetch_assoc()){
            $provincia = $table['provincia_nombre'];
            $id_provincia = $table['provincia_id'];

            $prov_con_id = (object)null;
            $prov_con_id->nombre = $provincia;
            $prov_con_id->id = $id_provincia;

            $array[] = $prov_con_id;
        }
        
        return json_encode($array);
    }

    public function __selectLocalidades($provincia){
        $sql = "SELECT * FROM localidades where localidad_provincia='$provincia';";
        $resultado = $this->conn->query($sql);
        while($table = $resultado->fetch_assoc()){
            $localidad = $table['localidad_nombre'];
            $id = $table['localidad_id'];

            $localidad_con_id = (object)null;
            $localidad_con_id->nombre = $localidad;
            $localidad_con_id->id = $id;
            $array[] = $localidad_con_id;
            
        }
        return json_encode($array);

    }

    
    public function __selectClientes(){
        $sql = "SELECT * FROM clientes NATURAL JOIN provincias NATURAL JOIN localidades where localidad_provincia = provincia_id and cliente_localidad = localidad_id;"; 
        $resultado = $this->conn->query($sql);
        while($table = $resultado->fetch_assoc()){
            $localidad = $table['localidad_nombre'];
            $id = $table['cliente_id'];
            $nombre = $table['cliente_nombre'];
            $dni = $table['cliente_dni'];
            $provincia = $table['provincia_nombre'];

            $datos_cliente = (object)null;
            $datos_cliente->nombre = $nombre;
            $datos_cliente->id = $id;
            $datos_cliente->localidad = $localidad;
            $datos_cliente->dni = $dni;
            $datos_cliente->provincia = $provincia;
            
            $array[] = $datos_cliente;
        }

        return json_encode($array);
    }

    public function __obtenerUsuario($id){
        $sql = "SELECT * FROM clientes NATURAL JOIN provincias NATURAL JOIN localidades where localidad_provincia = provincia_id and cliente_localidad = localidad_id and cliente_id = $id;"; 
        $resultado = $this->conn->query($sql);
        while($table = $resultado->fetch_assoc()){

            $localidad_id = $table['cliente_localidad'];
            $localidad_nombre = $table['localidad_nombre'];
            $id = $table['cliente_id'];
            $nombre = $table['cliente_nombre'];
            $dni = $table['cliente_dni'];
            $provincia_nombre = $table['provincia_nombre'];
            $provincia_id = $table['provincia_id'];

            $datos_cliente = (object)null;
            $datos_cliente->nombre = $nombre;
            $datos_cliente->id = $id;
            $datos_cliente->localidad_id = $localidad_id;
            $datos_cliente->localidad_nombre = $localidad_nombre;
            $datos_cliente->dni = $dni;
            $datos_cliente->provincia_id = $provincia_id;
            $datos_cliente->provincia_nombre = $provincia_nombre;
            
            $array[] = $datos_cliente;
        }

        return json_encode($array);
    }

    public function __editarUsuario($id_usr, $nombre_usr, $dni_usr, $loc_usr, $editar){
        $sql = "";
        $edit_boolean = filter_var($editar, FILTER_VALIDATE_BOOLEAN); 
        echo $editar;
        if ($edit_boolean==true){
            $sql = "UPDATE clientes SET cliente_nombre='$nombre_usr', cliente_dni=$dni_usr, cliente_localidad=$loc_usr WHERE cliente_id=$id_usr;";
        }   
        else{
            $sql = "INSERT INTO clientes (cliente_nombre,cliente_dni,cliente_localidad) VALUES ('$nombre_usr',$dni_usr,$loc_usr);";
        }
        $resultado = $this->conn->query($sql);
        header("Location: homepage.html");
    }


}

?>




