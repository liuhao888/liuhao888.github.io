---
layout: '[layout]'
title: RN 枚举相册
date: 2018-06-23 13:17:09
categories: 学习记录
comments: true
---

## RN 枚举相册
### 前言
项目中遇到一个需求：“用户在上传图片时，展示用户相册图片选择或者相机拍摄”，由于以前没有接触过这个方面，也遇到了很多问题，在此记录一下。

### 分析
搜索引擎搜索问题时我看到 `react-native-image-crop-picker` 和 `React Native Image Picker` 这两个库都支持选取和拍照、处理图片（前者比后者多了一个剪切功能）。但是实现方式是调用API进入系统相册进入选取，与需求中直接展示用户所有图片不符。后来发现 React—Native 官方有一个读取本地相册的API: `CameraRoll`;

### CameraRoll 配置
关于该方法RN中文网没有说的很清楚，详细可以看[这里](http://facebook.github.io/react-native/docs/cameraroll.html) 。

```
CameraRoll.getPhotos(params)
params :
 - first ：{number}：照片应用程序的逆序排列顺序的照片数量（即SavedPhotos最近的第一张照片）。
 - after：{string}：与page_info { end_cursor }之前调用返回的匹配的游标getPhotos。
 - groupTypes：{string}：指定要将结果过滤到的组类型。有效值是：
		* Album
		* All
		* Event
		* Faces
		* Library
		* PhotoStream
		* SavedPhotos //默认
- groupName ：{string}：指定群组名称上的过滤器，如“最近的照片”或自定义相册标题。
	* 
- assetType：{字符串}：指定资产类型的过滤器。有效值是：
		* All
		* Videos
		* Photos //默认
- mimeTypes ：{string}：按mimetype过滤（例如image / jpeg）。
> 返回一个Promise，它在解析时将具有以下形状：

- edges ：{Array <node>}节点对象数组
	* node：{object}具有以下形状的对象：
				* type：{string}
				* group_name：{string}
	* image：{object}：具有以下形状的对象：
					* uri：{string}
					* height：{number}
					* width：{number}
					* isStored：{布尔}
- page_info ：{object}：具有以下形状的对象：
		* has_next_page：{布尔}
		* start_cursor：{布尔}
		* end_cursor：{布尔}
```

在IOS上首先要LInk RCTCameraRoll 库，把 `node_module/react-native/Libraries/CameraRoll/RCTCameraRoll.xcodeproj` 添加到 `project name => Liberaries` ,  然后在 `Build Phases -> Link Binary With Libraries` 里添加 `libRCTCameraRoll.a`,如下图：
![Alt text](/images/page/RNPhotoAlbum/xcode.png)


以及在 `Info.plist` 添加获取照片相机权限及描述
```
<key>NSCameraUsageDescription</key>
<string>XXX需要获取相机权限，以提供更好的服务</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>XXX需要获取相册权限，以提供更好的服务</string>
```

### 代码
经过一系列的配置我们终于进入代码部分了，列表我采用0.41后推出的`FlatList` 优化渲染，不多废话直接看Dome代码

```
  componentDidMount() {
    this.setState({ isLoading: true }, () => {
      // 根据参数获取本地照片
      // default {
      //   first: 1000,
      //   groupTypes: "SavedPhotos",
      //   assetType: "Photos"
      // }
      CameraRoll.getPhotos(this.props.photosParams)
        .then(data => {
          this.setState({
            isLoading: false,
            photosData: data.edges,
            pageInfo: data.page_info
          });
        })
        .catch(e => {
          this.setState({ isLoading: false });
          console.log(e);
        });
    });
  }

  render() {
    const { photosData } = this.state;
    return (
      <View style={styles.flex}>
        <FlatList
          data={photosData || []}
          renderItem={this.renderItem}
          numColumns={rowNumber}
          refreshing={this.state.isLoading}
        />
      </View>
    );
  }

```
可以看到在 componentDidMount 中调用 `CameraRoll.getPhotos` 读取用户相册，处理后续 Promise 交由 FlatList 优化渲染（处理下拉加载更多或者上拉刷新等操作）。

现在只是把相册读取出来，我们还需要显示一个相机模块

```
if(index === 0){
      return this.renderCameraItem();
}
```

效果图如下：
![Alt text](/images/page/RNPhotoAlbum/photoAlbum.png)




dome部分完整代码：

```
export default class Example extends Component {
  constructor(props) {
    super(props);

    //计算图片尺寸
    const { width } = Dimensions.get("window");
    const itemSize = (width - (rowNumber + 1) * imageMargin) / rowNumber;

    this.state = {
      itemSize,
      photosData: [],
      pageInfo: {},
      isLoading: false
    };

    this.renderItem = this.renderItem.bind(this);
    this.renderCameraItem = this.renderCameraItem.bind(this);
  }

  componentDidMount() {
    this.setState({ isLoading: true }, () => {
      // 根据参数获取本地照片
      // default {
      //   first: 1000,
      //   groupTypes: "SavedPhotos",
      //   assetType: "Photos"
      // }
      CameraRoll.getPhotos(this.props.photosParams)
        .then(data => {
          const photosData = [{},...data.edges];
          this.setState({
            isLoading: false,
            photosData: photosData,
            pageInfo: data.page_info
          });
        })
        .catch(e => {
          this.setState({ isLoading: false });
          console.log(e);
        });
    });
  }

  renderCameraItem() {
    return (
      <View
        style={[
          styles.itemCamera,
          {
            height: this.state.itemSize,
            width: this.state.itemSize,
            marginLeft: imageMargin,
            marginBottom: imageMargin
          }
        ]}
      >
        <Text>相机拍照</Text>
      </View>
    );
  }

  renderItem({ item, index }) {
    if(index === 0){
      return this.renderCameraItem();
    }
    return (
      <Image
        source={{ uri: item.node.image.uri }}
        style={{
          width: this.state.itemSize,
          height: this.state.itemSize,
          marginLeft: imageMargin,
          marginBottom: imageMargin
        }}
      />
    );
  }

  render() {
    const { photosData } = this.state;
    return (
      <View style={styles.flex}>
        <FlatList
          data={photosData || []}
          renderItem={this.renderItem}
          numColumns={rowNumber}
          refreshing={this.state.isLoading}
        />
      </View>
    );
  }
}
```

### 后续优化

1. 实际场景中用户可能会存在有几千张照片，这种一次性读取的做法显然不可靠，所以我们可以使用`after` 属性。
2. 目前代码中照片的尺寸是判断设备的宽度计算的，可能不是最优做法，而且在手机横屏状态下会变形。

