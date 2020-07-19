import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Alert
} from "react-native";

import CrudService from '../../services/Crud/CrudService.js';

import RNFetchBlob from 'rn-fetch-blob';

export default class CardFiles extends Component {
    
    downloadFile = async (id, userData, fileName, navigation) => {
        
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
                        onPress: () => navigation.navigate('LoginEmailScreen'),
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
    
    render() {
        return (
            <TouchableOpacity onPress={() => this.downloadFile(this.props.attachment.attachmentId, this.props.userData, this.props.attachment.fileName, this.props.navigation)}>
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
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});