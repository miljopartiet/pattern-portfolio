require 'yaml'
class News
  attr_accessor :title, :time, :source, :source_title, :image_url
  def initialize attrs
    attrs.each do |meth, value|
      if self.respond_to? "#{meth}="
        self.public_send "#{meth}=", value
      end
    end
  end

  def icon
    "#{File.basename(source, '.*')}.png"
  end

  def self.all(limit = nil, offset = 0)
    @all ||= self.load.map do |attrs|
      self.new attrs
    end

    if limit && limit < @all.size
      @all[offset...(limit + offset)]
    else
      @all
    end
  end

  def self.load
    YAML::load File.open(self.source)
  end

  def self.source
    File.dirname(File.expand_path(__FILE__)) + '/../data/news.yml'
  end
end
