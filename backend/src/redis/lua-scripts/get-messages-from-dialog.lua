local from = ARGV[1]
local to = ARGV[2]

-- Определяем ключ диалога
local dialogKey = "dialog:" .. (from < to and from .. ":" .. to or to .. ":" .. from)

-- Проверяем, существует ли уже диалог
local exists = redis.call('EXISTS', dialogKey)

if exists == 0 then
    -- Если диалог не существует, возвращаем пустой массив
    return '[]'
else
    -- Если диалог существует, получаем все сообщения из списка
    local messages = redis.call('LRANGE', dialogKey, 0, -1)
    local result = {}
    for i, message in ipairs(messages) do
        result[i] = cjson.decode(message)
    end
    -- Возвращаем сообщения в формате JSON
    return cjson.encode(result);
end

