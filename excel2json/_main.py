"""
把excel导出json
"""

import sys
from openpyxl import load_workbook
from openpyxl.worksheet import worksheet
import json
import str2list


class SheetStruct:
    """ 表的导出信息 """

    # 服务端导出文件名称
    def serverName(self):
        pass

    # 客户端导出文件名称
    def clientName(self):
        pass

    # key的数量
    def keyCount(self):
        pass


class RowStruct:
    """ 导出数据的结构体信息 """

    # 字段名
    def _name(self):
        pass

    # 类型 (number, string, array, object)
    def _type(self):
        pass

    # 导出字段（S服务端C客户端）
    def _cs(self):
        pass


class Excel2Json:

    xlslUrl = ''
    # 配表信息定义的行数
    structRow = [4, 5, 6, 7]
    # 配表真实数据要导出的列数，每行的后面可能有些说明，但是是不用导出，所以需要记录要导出的真实列数，也就是structRow行的真实列数
    structColLen = 0
    # 配表真实数据开始的行数
    startRow = 8
    sheet: worksheet.Worksheet = None

    def __init__(self, xlsxUrl: str) -> None:
        self.xlslUrl = xlsxUrl

    def readFile(self):
        wb = load_workbook(filename=self.xlslUrl)
        # print(wb.sheetnames)
        # print(wb.worksheets)
        for sheet in wb.worksheets:
            # title中以#开头的表示不导出
            if sheet.title[0] == '#':
                continue
            self.sheet = sheet
            self.readSingleSheet()
        self.sheet = None
        self.xlslUrl = ''

    def getSheetStruct(self):
        """ 获取当个sheet导出文件的名称以及key数量 """
        serverName = self.sheet.cell(row=1, column=2).value
        clientName = self.sheet.cell(row=1, column=5).value
        keyCount = self.sheet.cell(row=2, column=2).value
        if (not (serverName or clientName)):
            return None
        struct = SheetStruct()
        struct.serverName = serverName
        struct.clientName = clientName
        struct.keyCount = keyCount
        return struct

    def getRowValue(self, row: int):
        """ 获取某行的数据 """
        columns = self.sheet.max_column
        rowData = []
        for i in range(1, columns+1):
            cellValue = self.sheet.cell(row=row, column=i).value
            # 单元格填0是需要导出的
            if cellValue == None:
                break
            rowData.append(cellValue)
        return rowData

    def getRowStruct(self):
        """ 导出数据的结构体信息 """
        row4 = self.getRowValue(self.structRow[0])
        row5 = self.getRowValue(self.structRow[1])
        row6 = self.getRowValue(self.structRow[2])
        row7 = self.getRowValue(self.structRow[3])
        rowStruct = {}
        self.structColLen = len(row5)
        for i in range(0, len(row5)):
            struct = RowStruct()
            struct._name = row5[i]
            struct._type = row6[i]
            struct._cs = row7[i]
            rowStruct[i] = struct
        return rowStruct

    def readSingleSheet(self):
        """ 处理单张sheet """
        sheetStruct = self.getSheetStruct()
        if (not sheetStruct):
            return
        # print(sheet.max_row, sheet.max_column)
        print('开始处理sheet：', self.sheet.title)
        self.dealEachRowData()

    def dealEachRowData(self):
        """ 读取每行配置，处理导出数据 """
        rowStruct = self.getRowStruct()
        if not rowStruct:
            return

        # 判断是否有客户端字段
        haveClient = False
        for idx in range(0, len(rowStruct)):
            if 'C' in rowStruct[idx]._cs:
                haveClient = True
                break
        if not haveClient:
            print('\t\t不需要导出json')
            return

        totalKey = self.getSheetStruct().keyCount  # 表中配置的key数量
        maxRow = self.sheet.max_row

        totalJson = {}
        for row in range(self.startRow, maxRow+1):
            rowData = self.getRowValue(row)
            if len(rowData) == 0 or rowData[0] == None:
                break

            eachRowJson = totalJson
            for key in range(0, totalKey):
                if not eachRowJson.get(rowData[key]):
                    eachRowJson[rowData[key]] = {}
                eachRowJson = eachRowJson.get(rowData[key])

            for col in range(0, self.structColLen):
                colStruct: RowStruct = rowStruct[col]
                if 'C' not in colStruct._cs:
                    continue
                if colStruct._type == 'array':
                    eachRowJson[colStruct._name] = str2list.strToList(
                        rowData[col])
                elif colStruct._type == 'object':
                    eachRowJson[colStruct._name] = json.loads(rowData[col])
                else:
                    eachRowJson[colStruct._name] = rowData[col]
        self.dealJsonData(totalJson)

    def dealJsonData(self, obj: dict):
        """ 导出json数据 """
        nameList = self.getSheetStruct()
        if not nameList.clientName:
            print('xlsx客户端配置名为空')
            return

        with open("output/"+nameList.clientName, "w", encoding='utf-8') as outfile:
            json.dump(obj, outfile, indent=2, ensure_ascii=False)
            # outfile.write(json.dumps(obj, indent=4, ensure_ascii=True))


if __name__ == '__main__':
    print(sys.argv)
    xlsxUrl = "./test.xlsx"
    if sys.argv and len(sys.argv) > 1 and sys.argv[1]:
        xlsxUrl = sys.argv[1]
    # print(xlsxUrl)

    excel2Json = Excel2Json(xlsxUrl)
    excel2Json.readFile()
