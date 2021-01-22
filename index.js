async function altaUser() {
    deleteFormulario1();
    await crearFormulario1('0', false);
    llenarSelects();
}

function crearRowsClientes(fetchResultado) {
    const $cl = document.querySelector('#clientes');
    fetchResultado.forEach((el) => {
        const td_nombre = document.createElement("td")
        const td_id = document.createElement("td")
        const td_dni = document.createElement("td")
        const td_localidad = document.createElement("td")
        const td_provincia = document.createElement("td")
        const tr = document.createElement("tr");
        td_nombre.innerText = el.nombre;
        td_nombre.className = 'cursor';
        td_id.innerText = el.id;
        td_dni.innerText = el.dni;
        td_localidad.innerText = el.localidad;
        td_provincia.innerText = el.provincia;
        tr.appendChild(td_nombre);
        tr.appendChild(td_id);
        tr.appendChild(td_dni);
        tr.appendChild(td_localidad);
        tr.appendChild(td_provincia);
        $cl.appendChild(tr);


        td_nombre.addEventListener('click', async function () {
            deleteFormulario1();
            await crearFormulario1(td_id.textContent, true);
            llenarSelects();
        });
    })
}


function crearRowsProvincias(fetchResultado) {
    const $provs = document.querySelector('#provs');
    fetchResultado.forEach((el) => {
        const td_prov_nombre = document.createElement('td');
        const td_prov_id = document.createElement('td');
        const td_localidad_nombre = document.createElement('td');
        const td_cantidad_clientes = document.createElement('td');
        const tr = document.createElement('tr');

        td_prov_nombre.innerText = el.prov_nombre;
        td_prov_id.innerText = el.prov_id;
        td_localidad_nombre.innerText = el.localidad_nombre;
        td_cantidad_clientes.innerText = el.cantidad_clientes;


        tr.appendChild(td_prov_id);
        tr.appendChild(td_prov_nombre);
        tr.appendChild(td_localidad_nombre);
        tr.appendChild(td_cantidad_clientes);
        $provs.appendChild(tr);

    });


}


function deleteFormulario1() {
    const $formulario = document.querySelector('#root').innerHTML = '';
}

async function crearFormulario1(id, $to_edit) {
    const $formulario = document.createElement('form');
    const $nombre = document.createElement('label');
    const $dni = document.createElement('label');
    const $localidad = document.createElement('select');
    const $provincia = document.createElement('select');

    $localidad.id = 'localidades';
    $provincia.id = 'provincias';

    $formulario.id = 'formulario';



    const $input_name = document.createElement('input');
    $input_name.type = 'text';
    $input_name.name = 'nombre';

    const $input_dni = document.createElement('input');
    $input_dni.type = 'number';
    $input_dni.name = 'dni';

    const $input_id = document.createElement('input');
    $input_id.type = 'hidden';
    $input_id.name = 'id';

    const $input_localidad = document.createElement('input');
    $input_localidad.type = 'hidden';
    $input_localidad.name = 'localidad_sel';
    $input_localidad.id = 'localidad_sel';

    const $input_edit = document.createElement('input');
    $input_edit.type = 'hidden';
    $input_edit.name = 'editar';
    $input_edit.id = 'edit';
    $input_edit.value = $to_edit;

    $nombre.innerText = "Nombre";
    $nombre.appendChild($input_name);

    $dni.innerText = "DNI";
    $dni.appendChild($input_dni);

    $formulario.appendChild($input_id);
    $formulario.appendChild($input_localidad);
    $formulario.appendChild($input_edit);

    $label_localidad = document.createElement('label');
    $label_localidad.innerText = 'Localidad';

    $label_provincia = document.createElement('label');
    $label_provincia.innerText = 'Provincia';

    if ($to_edit) {
        const usuario = await fetch("mainpage.php?usuario=" + id, { method: 'GET' });
        usuarioJson = await usuario.json();
        usuarioJson.forEach((el) => {

            $provincia.value = el.provincia_id;
            $localidad.value = el.localidad_id;

            $input_name.value = el.nombre;
            $input_dni.value = el.dni;
            $input_id.value = el.id;

        })
    }

    $div_principal = document.querySelector('#root');
    $div_principal.appendChild($formulario);
    $formulario.appendChild($nombre);
    $formulario.appendChild(document.createElement('br'));
    $formulario.appendChild($dni);
    $formulario.appendChild(document.createElement('br'));
    $formulario.appendChild($label_provincia);
    $formulario.appendChild($provincia);
    $formulario.appendChild(document.createElement('br'));
    $formulario.appendChild($label_localidad);
    $formulario.appendChild($localidad);
    $formulario.appendChild(document.createElement('br'));


    const $input_form = document.createElement('input');
    $input_form.type = 'submit';

    const $label_input = document.createElement('label');
    $label_input.appendChild($input_form);

    $formulario.appendChild($label_input);
    $formulario.action = 'mainpage.php';
    $formulario.method = 'post';

    $provincia.onchange = cargarLocalidades;
    $localidad.onchange = guardarLocalidad;




}

async function cargarClientes() {
    const clientes = await fetch("mainpage.php?clientes", { method: 'GET' });
    const clientesJson = await clientes.json();
    return clientesJson;
}

async function cargarProvincias() {
    const provincias = await fetch('mainpage.php?provincias', { method: 'GET' });
    const provinciasJson = await provincias.json();
    return provinciasJson;
}

//La función realizar se encarga de cargar todas las rows en las tablas.
async function realizar() {

    const clientes = await cargarClientes();
    await crearRowsClientes(clientes);
    const provs = await cargarProvincias();
    crearRowsProvincias(provs);
}

async function guardarLocalidad() {
    let localidad_select = document.querySelector("#localidades");
    let localidad = localidad_select.options[localidad_select.selectedIndex].value;
    document.querySelector('#localidad_sel').value = localidad;
}



const $provincias = document.querySelector('#provincias'); //Obtengo el select de provincias
const $localidades = document.querySelector('#localidades'); //Obtengo el select de localidades

function crearSelect(fetchResultado, $select) {
    fetchResultado.forEach((el) => {
        const option = document.createElement("option")
        option.value = el.id;
        option.innerText = el.nombre;
        $select.appendChild(option);
    })
}

async function obtenerProvincias() {
    const provincias = await fetch("mainpage.php", { method: 'GET' });
    const provinciasJson = await provincias.json();
    return provinciasJson;
}

async function obtenerLocalidades() {
    let elemento = document.querySelector("#provincias");
    let provincia = elemento.options[elemento.selectedIndex].value;
    const direccion = "mainpage.php?provincia=" + provincia;
    const localidades = await fetch(direccion, { method: 'GET' });
    const localidadesJson = await localidades.json();
    return localidadesJson;


}

async function cargarLocalidades() {
    const localidades = await obtenerLocalidades();
    document.querySelector('#localidades').innerHTML = "";
    await crearSelect(localidades, document.querySelector("#localidades"));
    await guardarLocalidad();

}

//llenarSelects se encarga de completas los select de provincias y de localidades.
async function llenarSelects() {
    const provincias = await obtenerProvincias();
    crearSelect(provincias, document.querySelector("#provincias"));
    await cargarLocalidades();
    await guardarLocalidad();

}

realizar();