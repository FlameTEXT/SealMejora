import json

res = []

profession_zh = {
    'PIONEER': '先锋',
    'SNIPER': '狙击',
    'CASTER': '术师',
    'MEDIC': '医疗',
    'WARRIOR': '近卫',
    'TANK': '重装',
    'SUPPORT': '辅助',
    'SPECIAL': '特种'
}

team_table = {}
handbook_dict = {}
with open('handbook_team_table.json', 'r', encoding='utf-8') as file:
    team_table = json.load(fp=file)

with open('handbook_info_table.json', 'r', encoding='utf-8') as file:
    handbook_dict = json.load(fp=file)
    handbook_dict = handbook_dict['handbookDict']

illust_dict = {}
with open('Illust.json', 'r', encoding='utf-8') as file:
    illust_dict = json.load(fp=file)

with open('character_table.json', 'r', encoding='utf-8') as file:
    table = json.loads(file.read())
    for k in table:
        k: str = k
        if not k.startswith("char"):
            continue
        if not k in handbook_dict:
            continue

        char = table[k]
        it = {}
        it['name'] = char['name']
        story:str = handbook_dict[k]['storyTextAudio'][0]['stories'][0]['storyText']
        tmp = story.split()
        for tmp_it in tmp:
            if tmp_it.startswith("【种族】"):
                it['race'] = tmp_it[4:]
            if tmp_it.startswith("【出身地】"):
                it['nation'] = tmp_it[5:]
            if tmp_it.startswith("【产地】"):
                it['nation'] = tmp_it[4:]


        teamId = char['teamId']
        none_team =  None # team_table['none']['powerName']
        it['teamId'] = team_table[teamId]['powerName'] if teamId in team_table else none_team

        groupId = char['groupId']
        if groupId in team_table:
            if it['teamId'] == none_team:
                it['teamId'] = team_table[groupId]['powerName']  # 阵营，能带来 Power

        it['profession'] = profession_zh[char['profession']]
        # it['subProfessionId'] = char['subProfessionId']  # 分支

        rarity: str = char['rarity']
        rarity = rarity.split('_')[1]
        it['rarity'] = int(rarity)

        if it['name'] in illust_dict:
            it['illust'] = illust_dict[it['name']]
        else:
            print(f"干员 {it['name']} 画师不明")

        if it['teamId'] == None:
            del it['teamId']

        res.append(it)
    print(len(res))

with open('data.json', 'w', encoding='utf-8') as file:
    data = {}
    for it in res:
        key = it['name']
        del it['name']
        data[key] = it
    json.dump(data, fp=file, ensure_ascii=False, sort_keys=True, indent=2)
