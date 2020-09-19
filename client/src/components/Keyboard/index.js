import React, {Component} from "react";
import API from "../../utils/API";
import Menu from "../Menu";
import WalmartCard from "../../pages/WalmartCard";
import AmazonCard from "../../pages/AmazonCard";
import TargetCard from "../../pages/TargetCard";

class Keyboard extends Component {
    state = {
        results: [],
        amazonResults: [],
        favs: [],
        targetResults: [],
    };

    // When this component mounts, search for the item "keyboard"
    componentDidMount() {
        this.searchItems("keyboard");
        this.searchAmazon("computerkeyboard");
        this.targetSearchItems("keyboard");
    }

    searchItems = query => {
        API.searchItems(query)
            .then(res => this.setState({results: res.data.items}))
            .catch(err => console.log(err));
    };

    searchAmazon = keyword => {
        API.searchAmazon(keyword)
            .then(res => this.setState({amazonResults: res.data}))
            .catch(err => console.log(err));
    };

    addFavoriteData = id => {

        console.log(`Clicked: ${id}`)

        let foundFav = this.state.results.filter(item => {
            // logic to match item ID
            return item.itemId == id;
        });

        console.log("***********");
        console.log(foundFav);

        // update State of FAVS array
        // this.setState({ favs: foundFav });

        // send OBJECT to backend route (server.js)
        API.saveFavorites(foundFav)
            .then(res => {
                console.log("Item Saved");
                console.log(res.data);
            })
            .catch(err => {
                console.log(err);
            });
    }

    targetSearchItems = query => {
        API.targetSearchItems(query)
            .then(res => this.setState({targetResults: res.data.products}))
            .then(this.getImage)
            .catch(err => console.log(err));
    };

    getImage = () => {
        const newData = this.state.targetResults.map(item => {
            let images = item.images
            images.map (image => {
                let base = image.base_url
                let guest = image.primary
                let url = base + guest

                item.targetImages = url
            })
            return item
        })
        this.setState({targetResults: newData})
    }

    render() {
        return (
            <div>
                {(this.state.targetImgs === {}) ? <div>Empty</div> : <div className="text-center mb-32">
                    <Menu/>
                    <main className="mt-5">
                        <div className="flex flex-wrap justify-center">
                            {this.state.results.map(item => {
                                return (
                                    <WalmartCard
                                        results={item}
                                        key={item.itemId}
                                        addFavorites={this.props.addFavorites}
                                        addFavoriteData={this.addFavoriteData}/>
                                )
                            })}
                        </div>
                        <div className="flex flex-wrap justify-center">
                            {this.state.amazonResults.map(item => {
                                return (
                                    <AmazonCard amazonResults={item} key={item.asin}
                                                addFavorites={this.props.addFavorites}/>
                                )
                            })}
                        </div>
                        <div className="flex flex-wrap justify-center">
                            {console.log(this.state.targetResults)}
                            {this.state.targetResults.map(item => {
                                    return (
                                        <TargetCard
                                            results={item}
                                            key={item.tcin}
                                            addFavorites={this.props.addFavorites}
                                        />
                                    )
                            })}
                        </div>
                    </main>
                </div>}
            </div>

        )
    }
}

export default Keyboard;
