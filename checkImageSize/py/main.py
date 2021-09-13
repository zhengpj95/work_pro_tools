import json
import os


def readJson():
    file = open('./config.json', 'r')
    content = file.read()
    obj = json.loads(content)
    file.close()
    return obj


def readDirList():
    # print('start to read ' + obj['root'])
    result = []
    # os.walk第二个参数表示是自定向下，还是自下向定
    # os.walk返回三元数组（root, dirs, files）
    # root表示路径
    # dirs表示当前路径中存在的文件夹，数组
    # files表示当前路径中存在的文件，数组
    for i, j, k in os.walk(obj['root']):
        # print(k)
        if (not filterFile(i)):
            continue
        for f in k:
            if obj['imgType'] in f:
                fileUrl = os.path.join(i, f)
                if (int(os.stat(fileUrl).st_size / 1024) >= int(obj['maxSize'])):
                    result.append(fileUrl)
    # print('end to ' + obj['root'])
    return result


def filterFile(fileUrl):
    filterList = obj['filterDir']
    for i in filterList:
        if i in fileUrl:
            return False
    return True


def writeResult():
    print('写入结果：', '\n'.join(result))
    if result is None:
        with open(os.path.join(os.getcwd(), 'outFile', 'result_py.txt'), 'a+', encoding='utf-8') as test:
            test.truncate(0)
        return

    # print('start to write file')
    outDir = os.path.join(os.getcwd(), 'outFile')
    print(outDir)
    if not os.path.exists(outDir):
        os.makedirs(outDir)
    f = open(outDir + '/result_py.txt', 'w')
    f.write('\n'.join(result))
    f.close()
    # print('end to write file')


if __name__ == '__main__':
    obj = readJson()
    if obj is None:
        print('not obj data')
    else:
        result = readDirList()
        writeResult()
