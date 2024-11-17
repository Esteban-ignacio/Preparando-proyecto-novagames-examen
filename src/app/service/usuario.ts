export class Usuario {
    iduser!: number;
    nombreuser!: string;
    apellidouser!: string;
    correo_user!: string;
    clave_user!: string;
    telefono_user!: number;
    imagen_user!: Blob; 
}
    
export class Datoslogin {
    nombrelogin!: string;
    correologin!: string;
    contrasenalogin!: string;

}
//para verificar si existen estos datos en la bd
export class Verificarcorreo {
    correoenregistro!: string;
    telefonoenregistro!: string;
    
}

export class Roles {
    idrol!: number;
    nombrerol!: string;
    
}

export class Extraerdatosusuario {
    iduser!: number;
    nombreuser!: string;
    apellidouser!: string;
    correo_user!: string;
    clave_user!: string;
    telefono_user!: string;
    imagen_user?: Blob; 
}

export class Correousuario {
    correo_usuario!: string;
}
    

