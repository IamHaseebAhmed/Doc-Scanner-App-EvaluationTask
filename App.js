import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ToastAndroid,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import RNImageToPdf from 'react-native-image-to-pdf';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';
import deleteIcon from './src/assets/img/deleteIcon.png';

const App = () => {
  const [images, setImages] = useState([]);

  // Using Camera Capture & Image Cropping
  const captureDocs = () => {
    ImagePicker.openCamera({
      cropping: true,
    }).then(image => {
      let newArr = [...images, {id: images.length, img: image.path}];
      setImages(newArr);
    });
  };

  // Deleting Docs
  const deleteDocs = id => {
    let newArr = images.filter(item => item.id != id);
    setImages(newArr);
  };

  // Generating PDF of Cropped Images
  const generatePDFdoc = async () => {
    let fileId = uuidv4();

    try {
      const options = {
        imagePaths: images.map(el => el.img.substring(7)),
        name: `DocScanner-${fileId}.pdf`,
        maxSize: {
          width: 1654,
          height: 2339,
        },
        quality: 1,
        targetPathRN: '/storage/emulated/0/Download/',
      };
      const pdf = await RNImageToPdf.createPDFbyImages(options);

      ToastAndroid.showWithGravity(
        `Your document has been saved at: ${pdf.filePath}`,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
    } catch (e) {
      ToastAndroid.showWithGravity(
        `Error: ${e}`,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
    }
  };

  const resetHandler = () => {
    setImages([]);
  };

  const renderItem = ({item}) => {
    return (
      <View
        style={{
          marginRight: 20,
          width: 200,
          height: 300,
        }}>
        <Image
          source={{uri: item.img}}
          style={{
            width: 200,
            height: 300,
            borderWidth: 6,
            borderColor: '#e1e1e1',
            position: 'relative',
          }}
        />
        <View style={{alignItems: 'center'}}>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => deleteDocs(item.id)}>
            <Image source={deleteIcon} style={styles.deleteIconSize} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Docx Scanner App</Text>

      {/* Button to Open Camera */}
      <TouchableOpacity
        style={[styles.btn, styles.bgRed]}
        onPress={captureDocs}>
        <Text style={{color: '#fff', fontFamily: 'WorkSans-Regular'}}>
          SCAN DOCX
        </Text>
      </TouchableOpacity>

      {/* List of Images after cropping */}
      <View style={{height: 350, marginBottom: 40}}>
        {images.length > 0 ? (
          <FlatList
            data={images}
            horizontal
            contentContainerStyle={{paddingHorizontal: 20}}
            keyExtractor={item => item.id}
            renderItem={renderItem}
          />
        ) : (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 18, fontFamily: 'WorkSans-Regular'}}>
              No images uploaded yet!
            </Text>
          </View>
        )}
      </View>

      {/* Button to Generate Doc pdf etc. */}
      <View>
        <TouchableOpacity
          style={[styles.btn, styles.bgGreen]}
          onPress={generatePDFdoc}
          disabled={images.length > 0 ? false : true}>
          <Text style={{color: '#fff', fontFamily: 'WorkSans-Regular'}}>
            GENERATE PDF
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, styles.bgGrey, {marginTop: -20}]}
          onPress={resetHandler}
          disabled={images.length > 0 ? false : true}>
          <Text style={{color: '#fff', fontFamily: 'WorkSans-Regular'}}>
            RESET
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  header: {
    fontSize: 22,
    fontFamily: 'WorkSans-Bold',
    backgroundColor: '#fff',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomWidth: 4,
    borderBottomColor: 'green',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 50,
    color: 'black',
  },
  btn: {
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 40,
    alignItems: 'center',
  },
  bgRed: {
    backgroundColor: 'red',
  },
  bgGrey: {
    backgroundColor: 'grey',
  },
  bgGreen: {backgroundColor: 'green'},
  deleteBtn: {
    padding: 10,
    backgroundColor: '#e1e1e1',
    width: 35,
    height: 35,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: -20,
  },
  deleteIconSize: {width: 20, height: 20},
});

export default App;
