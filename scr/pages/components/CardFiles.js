import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Alert,
    PermissionsAndroid
} from "react-native";

import Icon from 'react-native-vector-icons/FontAwesome';

import CrudService from '../../services/Crud/CrudService.js';

import RNFetchBlob from 'rn-fetch-blob';

export default class CardFiles extends Component {

    downloadFile = async (id, userData, fileName, navigation) => {

        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
                title: "Permissão para Download",
                message: "O App precisa de sua permissão para baixar arquivos neste dispositivo."
            }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            let crudService = new CrudService();
            let result = await crudService.get(`attachments/fileExists/${id}`, userData.token);
            
            if(result.status == 200){
                const { config, fs } = RNFetchBlob
            
                let DownloadDir = fs.dirs.DownloadDir 
                let options = {
                    fileCache: true,
                    addAndroidDownloads : {
                        useDownloadManager : true, 
                        notification : true,
                        path: DownloadDir + "/SIG/" + fileName, 
                        description : 'Baixando arquivo.'
                    }
                }
                config(options).fetch('GET', `http://sistemasig.duckdns.org:4999/sig/api/attachments?path=${result.data}`, {
                    Authorization : `Bearer ${userData.token}`
                }).then((res) => {
                    
                })
                .catch((error) => {
                    
                    Alert.alert(
                        "Erro",
                        "Ocorreu um erro. " + error,
                        [
                            {
                                text: "Ok",
                                style: "ok"
                            }
                        ],
                        { cancelable: false }
                    );
                })
            }
            else if(result.status == 401){
                Alert.alert(
                    "Sessão Expirada",
                    "Sua sessão expirou. Por favor, realize o login novamente.",
                    [
                        {
                            text: "Ok",
                            onPress: () => navigation.navigate('LoginEmail'),
                            style: "ok"
                        }
                    ],
                    { cancelable: false }
                );
            }
            else if(result.status == 400){
                Alert.alert(
                    "Erro",
                    result.data,
                    [
                        {
                            text: "Ok",
                            style: "ok"
                        }
                    ],
                    { cancelable: false }
                );
            }
            else{
                Alert.alert(
                    "Erro",
                    "Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.",
                    [
                        {
                            text: "Ok",
                            style: "ok"
                        }
                    ],
                    { cancelable: false }
                );
            }
        } 
        else {
            Alert.alert(
                "Permissão Negada!",
                "O App não possui permissão para fazer downloads neste dispositivo."
            );
        }
    }

    renderCard = () => {
        if(this.props.attachment.attachmentId != undefined){
            return  <TouchableOpacity onPress={() => this.downloadFile(this.props.attachment.attachmentId, this.props.userData, this.props.attachment.fileName, this.props.navigation)}>
                        <View style={{ height: 130, width: 130, borderWidth: 1, borderColor: '#bdc3c7', marginLeft: this.props.left, borderRadius: 15  }}> 
                            <View style={{ flex: 2, justifyContent: "center", alignItems: "center", paddingTop: 10 }}>
                                <Image source={this.props.imageUri}
                                    style={{ flex: 1, width: 50, height: 50, resizeMode: 'cover' }}
                                />
                            </View>
                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingTop: 10 }}>
                                <Text>{this.props.attachment.fileName.length > 14 ? `${this.props.attachment.fileName.substring(0, 14)}...` : this.props.attachment.fileName}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
        }
        else{
            return  <View style={{ height: 130, width: 130, borderWidth: 1, borderColor: '#bdc3c7', marginLeft: this.props.left, borderRadius: 15  }}> 
                        <TouchableOpacity style={{ flex: 1 }} onPress={() => this.props.removeAttachment(this.props.attachment.index)}>
                            <View style={{ marginLeft: 110 }}>
                                <Icon size={15} name='remove'></Icon>
                            </View>
                        </TouchableOpacity>
                        <View style={{ flex: 6 }}>
                            <View style={{ flex: 2, justifyContent: "center", alignItems: "center"}}>
                                <Image source={this.props.imageUri}
                                    style={{ flex: 2, width: 50, height: 50, resizeMode: 'cover' }}
                                />
                            </View>
                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingTop: 10 }}>
                                <Text>{this.props.attachment.name.length > 14 ? `${this.props.attachment.name.substring(0, 14)}...` : this.props.attachment.name}</Text>
                            </View>
                        </View>
                    </View>
        }
    }
    
    render() {
        return(
            <>
                {this.renderCard()}
            </>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});