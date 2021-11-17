""" 
简体转繁体
把皮肤中的简体统一转换成繁体，减少人工操作，直接一键完成
（代码中的也可以同步进行，代码里应该统一发布后的js文件替换，而不是直接修改原项目）
"""

import re
import os
import os.path
import xlwt
import opencc
converter = opencc.OpenCC('s2t')

# 皮肤路径
root = ""
fileList = []


def readFileList(url):
    print("start to read directory...")
    for root1, dirs, files in os.walk(url):
        for name in files:
            fileList.append(os.path.join(root1, name))
            # print(os.path.join(root1, name))
        # for name in dirs:
        #     print(os.path.join(root1, name))


def writeFileList(fileList):
    print("start to write file list...")
    workbook = xlwt.Workbook(encoding='utf-8')
    sheet1 = workbook.add_sheet('皮肤文件')
    count = 0
    for file in fileList:
        sheet1.write(count, 0, file)
        count = count + 1

    workbook.save(os.path.join(os.getcwd(), 'output.xlsx'))


def readEachFile(fileUrl):
    print("start to read file...")
    fileObj = open(fileUrl, encoding="utf8").read()
    # print(fileObj)
    pattern = re.compile(r'[\u4e00-\u9fa5]+')
    wordList = re.findall(pattern, fileObj)

    if (len(wordList) == 0):
        return

    print(wordList)
    newList = []
    haveDifference = False
    for i in range(len(wordList)):
        word = converter.convert(wordList[i])
        newList.append(word)
        if word != wordList[i]:
            haveDifference = True

    if (haveDifference == False):
        return

    print(newList)
    for i in range(len(wordList)):
        fileObj = fileObj.replace(wordList[i], newList[i])

    # print(fileObj)
    fo = open(fileUrl, 'w', 1, 'utf8')
    fo.write(fileObj)
    fo.close()
    print('-------------重写 ' + fileUrl + ' 成功')


readFileList(root)
# writeFileList(fileList)
for file in fileList:
    readEachFile(file)
